#!/bin/bash

# Terminate any lingering Playwright report servers
echo "Terminating any lingering Playwright processes..."
pkill -f "playwright.*show-report" || true
pkill -f "playwright.*test-server" || true
echo "All Playwright servers terminated"

# Run the tests
echo "Running Playwright tests..."
npx playwright test "$@"

exit_code=$?

# If tests fail, show the report automatically
if [ $exit_code -ne 0 ]; then
  echo "Tests failed. Opening report..."
  npx playwright show-report
fi

exit $exit_code 