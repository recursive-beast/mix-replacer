## v1.3.1

- Fix `delimiter.left` string in `README.md`.

## v1.3.0

- Support custom options. (`delimiters` is the only one supported for now)

## v1.2.0

- Support node.js versions `>= 10.12.0`
- Default to the public path if the `target_dir` is not specified or is an empty string.
- Force the `target_dir` to be inside the public path.
- Create the `target_dir` if it does not exist.

## v1.1.1

- deleted package-lock.json to avoid installing old dependency versions (with potential bugs and vulnerabilities) when
 running npm install.

## v1.1.0

- Throw an error to alert the user when the provided src pattern didn't yield any results.
