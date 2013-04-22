todos:
	@bin/cbuild todos --name app

open-todos:
	@open lib/todos/build/index.html

clean:
	@rm -rf lib/*/build

install:
	@npm install -d

.PHONY: todos open-todos clean
