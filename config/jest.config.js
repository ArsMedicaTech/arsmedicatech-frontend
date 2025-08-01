module.exports = {
  rootDir: '..',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    // Specifically map the style package to the mock
    '^@livekit/components-styles$': 'identity-obj-proxy',

    '^d3$': '<rootDir>/__mocks__/fileMock.js',
    '^d3-.*$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',

    // Use identity-obj-proxy for all style files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Mock MDXEditor CSS imports
    '^@mdxeditor/editor/style.css$': 'identity-obj-proxy',

    // Mock MDXEditor package
    '^@mdxeditor/editor$': '<rootDir>/__mocks__/mdxEditorMock.js',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: './config/babel.config.js' },
    ],
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['/node_modules/(?!(d3|d3-[^/]+)/)'],
};
