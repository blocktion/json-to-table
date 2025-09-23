import React, { useEffect, useMemo } from "react";
import { JsonTableProps, EditableTableOptions } from "../types";
import { useTableData } from "../hooks/useTableData";
import { useColumnGeneration } from "../hooks/useColumnGeneration";
import { useNavigation } from "../hooks/useNavigation";
import { useDataMutation } from "../hooks/useDataMutation";
import { useValidation } from "../hooks/useValidation";
import { ThemeProvider } from "../styles/theme-provider";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../styles/styled-components";
import { TableContainer } from "./Table/TableContainer";
import { NavigationControls } from "./Navigation/NavigationControls";
import { BulkActions } from "./Editing/BulkActions";
import { ValidationProvider } from "./Validation/ValidationProvider";

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

  // Enhanced with editing capabilities
  const {
    data: editableData,
    changes,
    editState,
    setEditState,
    deleteRow,
    updateField,
    deleteField,
    addField,
    bulkDelete,
    saveChanges,
    discardChanges,
    hasChanges,
  } = useDataMutation(
    (processedData?.validated as unknown[]) || [],
    options as EditableTableOptions
  );

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
        {/* Bulk Actions */}
        {options.enableBulkOperations && (
          <BulkActions
            selectedRows={editState.selectedRows}
            onBulkDelete={() => bulkDelete(Array.from(editState.selectedRows))}
            onBulkEdit={() =>
              setEditState((prev) => ({ ...prev, isBulkMode: true }))
            }
            onClearSelection={() =>
              setEditState((prev) => ({ ...prev, selectedRows: new Set() }))
            }
            enableBulkOperations={options.enableBulkOperations || false}
          />
        )}

        {/* Changes Summary */}
        {hasChanges && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-yellow-800">
                {changes.length} pending change{changes.length !== 1 ? "s" : ""}
              </span>
              <div className="space-x-2">
                <button
                  onClick={saveChanges}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={discardChanges}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

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
          // New editing props
          editState={editState}
          setEditState={setEditState}
          onDeleteRow={deleteRow}
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
