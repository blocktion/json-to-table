# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Row Creation Functionality**: Complete implementation of row addition capabilities
  - `addRow()` function in `useDataMutation` hook
  - `AddRowButton` and `QuickAddRowButton` components
  - `"row_add"` type in `DataChange` interface
  - `onRowAdd` event handler in `EditableTableOptions`
  - Integration with existing change tracking and validation systems
- GitHub Actions workflow for automated publishing
- Comprehensive modular usage examples
- Enhanced documentation with company context

## [1.1.0] - 2024-01-21

### Added

- **Major Feature: Comprehensive Editing System**

  - Inline editing capabilities for all field types
  - Row management with selection, deletion, and bulk operations
  - Field-level operations (add, update, delete)
  - Real-time validation with custom rules
  - Change tracking and audit trail
  - Save/discard functionality with confirmation

- **New Components**:

  - `EditableCell` - Inline editing component with type-specific editors
  - `RowActions` - Row selection, edit, and delete action buttons
  - `BulkActions` - Bulk operation controls for multiple rows
  - `ValidationProvider` - Validation context and management
  - `ValidationMessage` - Error display component

- **New Hooks**:

  - `useDataMutation` - Data state management and change tracking
  - `useValidation` - Real-time field validation logic

- **Field Editors**:

  - `TextEditor` - Text input with validation
  - `NumberEditor` - Number input with type conversion
  - `BooleanEditor` - Boolean selection dropdown
  - `DateEditor` - Date/time picker
  - `SelectEditor` - Custom select dropdown
  - `createFieldEditor` - Factory function for type-specific editors

- **Enhanced Types**:

  - `EditableTableOptions` - Extended table options with editing capabilities
  - `DataChange` - Change tracking and audit trail
  - `ValidationRule` - Custom validation rule definitions
  - `EditState` - Editing state management
  - `EditableColumn` - Enhanced column with editing properties

- **User Experience Improvements**:

  - Keyboard navigation (Enter, Escape, Tab)
  - Visual feedback for editable fields and validation errors
  - Row selection with checkboxes
  - Bulk operations interface
  - Change summary display
  - Type-specific editing interfaces

- **Developer Experience**:
  - Comprehensive editing demo (`editing-demo.tsx`)
  - Implementation examples (`editing-implementation-example.tsx`)
  - Updated documentation with editing features
  - Backward compatibility maintained

### Changed

- Extended `TableOptions` interface with editing capabilities
- Enhanced `JsonTable` component with editing props
- Updated `TableContainer` and `TableBody` to support editing
- Improved type safety with new editing types

### Technical Details

- **New Dependencies**: None (uses existing React patterns)
- **Bundle Size Impact**: ~15 kB additional (editing features)
- **Backward Compatibility**: 100% maintained
- **TypeScript**: Full type safety for all new features

## [1.0.0] - 2024-01-20

### Added

- **Initial Release** of `@parallaxsolutions/json-to-table`
- **Core Features**:

  - Automatic column detection from JSON data structures
  - Nested navigation with sub-table support
  - Smart sorting with intelligent type detection
  - Advanced filtering with multiple operators
  - Built-in pagination for large datasets
  - Array merging for repeated columns
  - Breadcrumb navigation system
  - Custom cell renderers
  - Responsive design with horizontal scrolling

- **Theme System**:

  - Three built-in themes: `default`, `dark`, `minimal`
  - Custom theme support with `ThemeProvider`
  - CSS-in-JS styling with theme-aware components
  - Consistent design tokens and spacing

- **Modular Architecture**:

  - Main component: `JsonTable`
  - Individual components: `TableContainer`, `TableHeader`, `TableBody`, `NavigableCell`
  - Custom hooks: `useTableData`, `useSorting`, `usePagination`, `useNavigation`, `useFiltering`
  - Utility functions: `ArrayAnalyzer`, `ObjectUtils`
  - Theme system: `ThemeProvider`, `useTheme`, built-in themes

- **TypeScript Support**:

  - Full TypeScript definitions
  - Comprehensive type safety
  - IntelliSense support for all components and hooks

- **Performance Optimizations**:

  - Memoized operations to prevent unnecessary recalculations
  - Efficient rendering with minimal re-renders
  - Lazy loading for nested data
  - Optimized array and object processing

- **Developer Experience**:
  - Comprehensive documentation with examples
  - Modular imports for tree-shaking
  - ESLint and Prettier configuration
  - TypeScript strict mode compliance

### Technical Details

- **Dependencies**: React 16.8+, TypeScript 5.0+
- **Bundle Size**: ~52.5 kB (compressed)
- **Package Size**: 266.8 kB (unpacked)
- **File Count**: 109 files in distribution

### Company Context

- Developed by [Parallax Solutions](https://parallaxsolutions.org)
- Part of the **Blocktion SaaS project** ecosystem
- Originally built for Blocktion's data exploration features
- Now available as open-source package for the React community

### Breaking Changes

- None (initial release)

### Migration Guide

- N/A (initial release)

---

## Version History

- **v1.1.0**: Major editing system with inline editing, row management, validation, and change tracking
- **v1.0.0**: Initial release with full feature set and modular architecture

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Support

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/parallaxsolutions/json-to-table/issues)
- **Email**: info@parallaxsolutions.org
- **Website**: [parallaxsolutions.org](https://parallaxsolutions.org)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
