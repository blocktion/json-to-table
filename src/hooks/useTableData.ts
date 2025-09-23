import { useState, useEffect, useMemo } from "react";
import { DataProcessor, ProcessedData } from "../core/DataProcessor";
import { TableOptions } from "../types";

export const useTableData = (rawData: unknown[], options: TableOptions) => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stabilize options so we don't retrigger effects on every render when caller passes a new object
  const optionsSignature = useMemo(
    () => JSON.stringify(options ?? {}),
    [options]
  );

  useEffect(() => {
    const processData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const processor = DataProcessor.getInstance();
        const processed = processor.processData(rawData);
        setProcessedData(processed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    if (rawData && rawData.length > 0) {
      processData();
    } else {
      setProcessedData(null);
      setIsLoading(false);
      setError(null);
    }
  }, [rawData, optionsSignature]);

  return { processedData, isLoading, error };
};
