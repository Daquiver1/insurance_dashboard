// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Simulates a browser environment
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Setup file for additional configurations
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js", // Mock asset imports
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Use ts-jest for TypeScript files
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore node_modules and build directories
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // File extensions to process
};
