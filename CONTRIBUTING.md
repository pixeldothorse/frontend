# How to contribute to pixel.horse

## Reporting bugs

- **Make sure you're in the right repo first.**

  pixel.horse is divided into two repos, currently. Right now, you're reading the `CONTRIBUTING.md` file for the **front end** of the game, which exists on the web. If you've found a UI bug, something that triggers an error in the debug console, etc, it probably belongs here. If you've found a bug on the server (_e.g_: broken profiles, login errors, _etc_), it should be submitted to the [main pixeldothorse repo](https://github.com/pixeldothorse/pixeldothorse) repo instead.

- **Verify that you can reproduce the bug without browser extensions, user scripts, etc.**

  Sometimes, browser extensions get in the way. There could be a number of things specific to your system configuration that could prevent the game from working properly. In order for us to reproduce your bug, you should attempt to reproduce it on a clean browser instance (incognito, perhaps, or with all extensions disabled). If it's a major conflict with a popular extension, it may be beneficial to report, but in most cases, it's probably down to individual configuration.

- **Make sure the bug hasn't already been reported by searching the [issues page](https://github.com/pixeldothorse/frontend/issues).**

- If you can't find any issues matching yours, [open a new one](https://github.com/pixeldothorse/frontend/issues/new?template=bug).

  Be sure to be as clear as possible when submitting a bug report. "It doesn't work" or "it caused an error" aren't enough for us to figure out what happened. Provide clear, reproducible steps, and a clear and accurate description of the expected vs actual result. If possible, use the provided issue templates. Video is also acceptable, but steps would be preferred.

## Patching bugs

- **MAKE SURE YOUR PATCHES PASS TESTS AND LINTERS!**

  This is probably one of the most important points. If your code doesn't pass the linter, you should fix any linter errors before submitting your patch. To run the linter, run `yarn lint` in the package root.

  Similarly, ensure your code passes our unit tests. Failing tests is unacceptable. If you believe the tests are wrong, explain this in your PR, and perhaps submit a patch against the tests as well. To run the unit tests, run `yarn test` in the package root.

- **Ensure your changes are substantial.**

  Please don't use our repository for PR farming. Simple changes like whitespace fixes, copyright updates, spelling mistakes, _etc_ are **very unlikely** to be accepted.

- **Open a GitHub pull request with your suggested patch.**

  Your PR should include relevant information in the body, such as the relevant issue number (if applicable), a brief summary of the problem you found, and a description of your proposed solution.

## Feature requests/updates

- **Suggest the change to us through an issue.**

  [Click here](https://github.com/pixeldothorse/frontend/issues/new?template=feature) to open a new feature request with a helpful template.

  You can write code at this point, but we'd like to judge the usefulness and quality of your suggestion before it gets added to the game. Remember to keep your repositories straight, of course; don't submit API update suggestions to the `frontend` repo, and vice versa.

## Thank you!

pixel.horse is devoted to facilitating community involvement as much as we can. We encourage our users to pitch in wherever they see fit.

Thank you for your contribution!

With love,\
\- *pixel.horse team*
