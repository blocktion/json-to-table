import React, { useEffect, useMemo } from "react";
import { JsonTableProps } from "../types";
import { useTableData } from "../hooks/useTableData";
import { useColumnGeneration } from "../hooks/useColumnGeneration";
import { useNavigation } from "../hooks/useNavigation";
import { ThemeProvider } from "../styles/theme-provider";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../styles/styled-components";
import { TableContainer } from "./Table/TableContainer";
import { NavigationControls } from "./Navigation/NavigationControls";

export const JsonTable: React.FC<JsonTableProps> = ({
  data,
  title = "Data Table",
  className = "",
  options = {},
  theme = "default",
  onRowClick,
  onCellClick,
  customRenderers = {},
}) => {
  const { processedData, isLoading, error } = useTableData(data, options);

  const { navigationState, navigateToSubTable, navigateBack, navigateToRoot } =
    useNavigation((processedData?.validated as unknown[]) || []);

  // Keep navigation root in sync with processed root data when not in a subtable
  useEffect(() => {
    if (
      processedData?.validated &&
      Array.isArray(processedData.validated) &&
      navigationState.stack.length === 0 &&
      navigationState.currentData !== processedData.validated
    ) {
      navigateToRoot(processedData.validated as unknown[]);
    }
  }, [
    processedData?.validated,
    navigationState.stack.length,
    navigationState.currentData,
    navigateToRoot,
  ]);

  const effectiveData = useMemo(() => {
    if (!processedData) return null;

    // For navigation data, we need to re-analyze the structure
    const currentData = navigationState.currentData;
    const isArray = Array.isArray(currentData);

    let analyzed;
    if (isArray) {
      const { ArrayAnalyzer } = require("../utils/arrayUtils");
      const analysis = ArrayAnalyzer.analyzeContent(currentData);
      analyzed = {
        isArray: true,
        isObject: false,
        objectKeys:
          analysis.type === "objects"
            ? ArrayAnalyzer.extractAllKeys(analysis.sampleObjects || [])
            : [],
        depth: 1,
        sampleData: currentData.slice(0, 1),
        arrayContentType: analysis.type,
      };
    } else {
      analyzed = processedData.analyzed;
    }

    return {
      ...processedData,
      validated: currentData,
      raw: currentData,
      parsed: currentData,
      analyzed,
    };
  }, [processedData, navigationState.currentData]);

  const columns = useColumnGeneration(effectiveData, {
    maxDepth: options.maxDepth,
    mergeRepeatedColumns: options.mergeRepeatedColumns,
    customRenderers,
  });

  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return <LoadingSpinner className={className} />;
    }

    // Error state
    if (error) {
      return (
        <ErrorMessage
          className={className}
          title="Error Loading Data"
          message={error}
        />
      );
    }

    // Empty state
    if (
      !processedData ||
      !navigationState.currentData ||
      navigationState.currentData.length === 0
    ) {
      return (
        <EmptyState
          className={className}
          title={navigationState.currentTitle}
          message="No data available"
        />
      );
    }

    // Validation errors
    if (processedData.metadata.errors.length > 0) {
      return (
        <ErrorMessage
          className={className}
          title="Data Validation Error"
          message={processedData.metadata.errors.join(", ")}
        />
      );
    }

    return (
      <div className={`w-full ${className}`}>
        <NavigationControls
          navigationState={navigationState}
          onNavigateBack={navigateBack}
          onNavigateToRoot={() =>
            navigateToRoot(processedData.validated as unknown[])
          }
        />

        <TableContainer
          data={effectiveData as any}
          columns={columns}
          title={navigationState.currentTitle}
          options={options}
          onRowClick={onRowClick}
          onCellClick={onCellClick}
          onNavigateToSubTable={navigateToSubTable}
          customRenderers={customRenderers}
        />
      </div>
    );
  };

  return <ThemeProvider theme={theme}>{renderContent()}</ThemeProvider>;
};
