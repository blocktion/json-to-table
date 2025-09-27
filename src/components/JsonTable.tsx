import React, { useEffect, useMemo } from "react";
import { JsonTableProps, EditableTableOptions } from "../types";
import { useTableData } from "../hooks/useTableData";
import { useColumnGeneration } from "../hooks/useColumnGeneration";
import { useNavigation } from "../hooks/useNavigation";
import { useDataMutation } from "../hooks/useDataMutation";
import { useValidation } from "../hooks/useValidation";
import { ThemeProvider } from "../styles/theme-provider";
import { enhanceColumnsForEditing } from "../utils/columnEnhancer";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../styles/styled-components";
import { TableContainer } from "./Table/TableContainer";
import { NavigationControls } from "./Navigation/NavigationControls";
import { ValidationProvider } from "./Validation/ValidationProvider";

export const JsonTable: React.FC<JsonTableProps> = ({
  data,
  className = "",
  options = {},
  theme = "default",
  showBreadcrumbs = true,
  onRowClick,
  onCellClick,
  customRenderers = {},
  // Editing event handlers
  onDataChange,
  onRowAdd,
  onRowDelete,
  onFieldUpdate,
  onFieldDelete,
  onBulkDelete,
}) => {
  const { processedData, isLoading, error } = useTableData(data, options);

  const { navigationState, navigateToSubTable, navigateBack, navigateToRoot } =
    useNavigation((processedData?.validated as unknown[]) || []);

  // Enhanced with editing capabilities
  const {
    data: editableData,
    changes,
    editState,
    setEditState,
    deleteRow,
    addRow,
    updateField,
    deleteField,
    addField,
    bulkDelete,
    saveChanges,
    discardChanges,
    hasChanges,
  } = useDataMutation(data, {
    ...options,
    onDataChange,
    onRowAdd,
    onRowDelete,
    onFieldUpdate,
    onFieldDelete,
    onBulkDelete,
  } as EditableTableOptions);

  // Validation
  const { validateField, validateRow } = useValidation(
    options.validationRules || []
  );

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

    // Use editable data if editing is enabled, otherwise use navigation data
    const currentData = options.enableEditing
      ? editableData
      : navigationState.currentData;

    // If we have no current data, return the original processed data
    if (
      !currentData ||
      (Array.isArray(currentData) && currentData.length === 0)
    ) {
      return processedData;
    }

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
  }, [
    processedData,
    navigationState.currentData,
    editableData,
    options.enableEditing,
  ]);

  const generatedColumns = useColumnGeneration(effectiveData, {
    maxDepth: options.maxDepth,
    mergeRepeatedColumns: options.mergeRepeatedColumns,
    customRenderers,
  });

  const columns = useMemo(() => {
    return enhanceColumnsForEditing(generatedColumns, options.enableEditing);
  }, [generatedColumns, options.enableEditing]);

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
        {showBreadcrumbs && (
          <NavigationControls
            navigationState={navigationState}
            onNavigateBack={navigateBack}
          />
        )}

        <TableContainer
          data={effectiveData as any}
          columns={columns}
          options={options}
          onRowClick={onRowClick}
          onCellClick={onCellClick}
          onNavigateToSubTable={navigateToSubTable}
          customRenderers={customRenderers}
          // New editing props
          editState={editState}
          setEditState={setEditState}
          onDeleteRow={deleteRow}
          onAddRow={addRow}
          onUpdateField={updateField}
          onDeleteField={deleteField}
          onAddField={addField}
          validateField={validateField}
        />
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <ValidationProvider rules={options.validationRules || []}>
        {renderContent()}
      </ValidationProvider>
    </ThemeProvider>
  );
};
