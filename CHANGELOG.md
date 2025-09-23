# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- GitHub Actions workflow for automated publishing
- Comprehensive modular usage examples
- Enhanced documentation with company context

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
