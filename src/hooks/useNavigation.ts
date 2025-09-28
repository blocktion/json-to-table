import { useState, useEffect, useCallback } from "react";
import { NavigationManager } from "../core/NavigationManager";
import {
  NavigationStackItem,
  NavigationResult,
  NavigationListener,
} from "../types";

export interface NavigationState {
  stack: NavigationStackItem[];
  currentData: unknown[];
  currentTitle: string;
  breadcrumb: string[];
}

export const useNavigation = (initialData: unknown[] = []) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    stack: [],
    currentData: initialData,
    currentTitle: "Root Table",
    breadcrumb: ["Root"],
  });

  const [navigationManager] = useState(() => new NavigationManager());

  useEffect(() => {
    const listener: NavigationListener = {
      onNavigationChange: (result: NavigationResult) => {
        if (result.success) {
          setNavigationState((prev) => ({
            ...prev,
            currentData: result.newData || [],
            currentTitle: result.newTitle || "Root",
            breadcrumb: result.breadcrumb || ["Root"],
          }));
        }
      },
    };

    navigationManager.addListener(listener);
    return () => navigationManager.removeListener(listener);
  }, [navigationManager]);

  const navigateToSubTable = useCallback(
    (
      path: string,
      value: unknown,
      title: string,
      rootDocumentIndex?: number
    ) => {
      const result = navigationManager.navigateToSubTable(
        path,
        value,
        title,
        rootDocumentIndex
      );
      if (result.success) {
        setNavigationState((prev) => ({
          ...prev,
          stack: navigationManager.getCurrentStack(),
        }));
      }
      return result;
    },
    [navigationManager]
  );

  const navigateBack = useCallback(
    (targetLevel: number) => {
      const result = navigationManager.navigateBack(targetLevel);
      if (result.success) {
        setNavigationState((prev) => ({
          ...prev,
          stack: navigationManager.getCurrentStack(),
        }));
      }
      return result;
    },
    [navigationManager]
  );

  const navigateToRoot = useCallback(
    (rootData: unknown[]) => {
      const result = navigationManager.navigateToRoot(rootData);
      if (result.success) {
        setNavigationState((prev) => ({
          ...prev,
          stack: [],
          currentData: rootData,
          currentTitle: "Root Table",
          breadcrumb: ["Root"],
        }));
      }
      return result;
    },
    [navigationManager]
  );

  const canNavigate = useCallback(
    (value: unknown) => {
      return navigationManager.canNavigate(value);
    },
    [navigationManager]
  );

  return {
    navigationState,
    navigateToSubTable,
    navigateBack,
    navigateToRoot,
    canNavigate,
  };
};
