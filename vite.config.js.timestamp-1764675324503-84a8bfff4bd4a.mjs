// vite.config.js
import path3 from "node:path";
import react from "file:///C:/Users/Usuario/prospera-pages/node_modules/@vitejs/plugin-react/dist/index.js";
import { createLogger, defineConfig } from "file:///C:/Users/Usuario/prospera-pages/node_modules/vite/dist/node/index.js";

// plugins/visual-editor/vite-plugin-react-inline-editor.js
import path2 from "path";
import { parse as parse2 } from "file:///C:/Users/Usuario/prospera-pages/node_modules/@babel/parser/lib/index.js";
import traverseBabel2 from "file:///C:/Users/Usuario/prospera-pages/node_modules/@babel/traverse/lib/index.js";
import * as t from "file:///C:/Users/Usuario/prospera-pages/node_modules/@babel/types/lib/index.js";
import fs2 from "fs";

// plugins/utils/ast-utils.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import generate from "file:///C:/Users/Usuario/prospera-pages/node_modules/@babel/generator/lib/index.js";
import { parse } from "file:///C:/Users/Usuario/prospera-pages/node_modules/@babel/parser/lib/index.js";
import traverseBabel from "file:///C:/Users/Usuario/prospera-pages/node_modules/@babel/traverse/lib/index.js";
import {
  isJSXIdentifier,
  isJSXMemberExpression
} from "file:///C:/Users/Usuario/prospera-pages/node_modules/@babel/types/lib/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Usuario/prospera-pages/plugins/utils/ast-utils.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname2 = path.dirname(__filename);
var VITE_PROJECT_ROOT = path.resolve(__dirname2, "../..");
function validateFilePath(filePath) {
  if (!filePath) {
    return { isValid: false, error: "Missing filePath" };
  }
  const absoluteFilePath = path.resolve(VITE_PROJECT_ROOT, filePath);
  if (filePath.includes("..") || !absoluteFilePath.startsWith(VITE_PROJECT_ROOT) || absoluteFilePath.includes("node_modules")) {
    return { isValid: false, error: "Invalid path" };
  }
  if (!fs.existsSync(absoluteFilePath)) {
    return { isValid: false, error: "File not found" };
  }
  return { isValid: true, absolutePath: absoluteFilePath };
}
function parseFileToAST(absoluteFilePath) {
  const content = fs.readFileSync(absoluteFilePath, "utf-8");
  return parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
    errorRecovery: true
  });
}
function findJSXElementAtPosition(ast, line, column) {
  let targetNodePath = null;
  let closestNodePath = null;
  let closestDistance = Infinity;
  const allNodesOnLine = [];
  const visitor = {
    JSXOpeningElement(path4) {
      const node = path4.node;
      if (node.loc) {
        if (node.loc.start.line === line && Math.abs(node.loc.start.column - column) <= 1) {
          targetNodePath = path4;
          path4.stop();
          return;
        }
        if (node.loc.start.line === line) {
          allNodesOnLine.push({
            path: path4,
            column: node.loc.start.column,
            distance: Math.abs(node.loc.start.column - column)
          });
        }
        if (node.loc.start.line === line) {
          const distance = Math.abs(node.loc.start.column - column);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestNodePath = path4;
          }
        }
      }
    },
    // Also check JSXElement nodes that contain the position
    JSXElement(path4) {
      var _a;
      const node = path4.node;
      if (!node.loc) {
        return;
      }
      if (node.loc.start.line > line || node.loc.end.line < line) {
        return;
      }
      if (!((_a = path4.node.openingElement) == null ? void 0 : _a.loc)) {
        return;
      }
      const openingLine = path4.node.openingElement.loc.start.line;
      const openingCol = path4.node.openingElement.loc.start.column;
      if (openingLine === line) {
        const distance = Math.abs(openingCol - column);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestNodePath = path4.get("openingElement");
        }
        return;
      }
      if (openingLine < line) {
        const distance = (line - openingLine) * 100;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestNodePath = path4.get("openingElement");
        }
      }
    }
  };
  traverseBabel.default(ast, visitor);
  const threshold = closestDistance < 100 ? 50 : 500;
  return targetNodePath || (closestDistance <= threshold ? closestNodePath : null);
}
function generateCode(node, options = {}) {
  const generateFunction = generate.default || generate;
  const output = generateFunction(node, options);
  return output.code;
}
function generateSourceWithMap(ast, sourceFileName, originalCode) {
  const generateFunction = generate.default || generate;
  return generateFunction(ast, {
    sourceMaps: true,
    sourceFileName
  }, originalCode);
}

// plugins/visual-editor/vite-plugin-react-inline-editor.js
var EDITABLE_HTML_TAGS = ["a", "Button", "button", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "label", "Label", "img"];
function parseEditId(editId) {
  const parts = editId.split(":");
  if (parts.length < 3) {
    return null;
  }
  const column = parseInt(parts.at(-1), 10);
  const line = parseInt(parts.at(-2), 10);
  const filePath = parts.slice(0, -2).join(":");
  if (!filePath || isNaN(line) || isNaN(column)) {
    return null;
  }
  return { filePath, line, column };
}
function checkTagNameEditable(openingElementNode, editableTagsList) {
  if (!openingElementNode || !openingElementNode.name)
    return false;
  const nameNode = openingElementNode.name;
  if (nameNode.type === "JSXIdentifier" && editableTagsList.includes(nameNode.name)) {
    return true;
  }
  if (nameNode.type === "JSXMemberExpression" && nameNode.property && nameNode.property.type === "JSXIdentifier" && editableTagsList.includes(nameNode.property.name)) {
    return true;
  }
  return false;
}
function validateImageSrc(openingNode) {
  if (!openingNode || !openingNode.name || openingNode.name.name !== "img") {
    return { isValid: true, reason: null };
  }
  const hasPropsSpread = openingNode.attributes.some(
    (attr) => t.isJSXSpreadAttribute(attr) && attr.argument && t.isIdentifier(attr.argument) && attr.argument.name === "props"
  );
  if (hasPropsSpread) {
    return { isValid: false, reason: "props-spread" };
  }
  const srcAttr = openingNode.attributes.find(
    (attr) => t.isJSXAttribute(attr) && attr.name && attr.name.name === "src"
  );
  if (!srcAttr) {
    return { isValid: false, reason: "missing-src" };
  }
  if (!t.isStringLiteral(srcAttr.value)) {
    return { isValid: false, reason: "dynamic-src" };
  }
  if (!srcAttr.value.value || srcAttr.value.value.trim() === "") {
    return { isValid: false, reason: "empty-src" };
  }
  return { isValid: true, reason: null };
}
function inlineEditPlugin() {
  return {
    name: "vite-inline-edit-plugin",
    enforce: "pre",
    transform(code, id) {
      if (!/\.(jsx|tsx)$/.test(id) || !id.startsWith(VITE_PROJECT_ROOT) || id.includes("node_modules")) {
        return null;
      }
      const relativeFilePath = path2.relative(VITE_PROJECT_ROOT, id);
      const webRelativeFilePath = relativeFilePath.split(path2.sep).join("/");
      try {
        const babelAst = parse2(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
          errorRecovery: true
        });
        let attributesAdded = 0;
        traverseBabel2.default(babelAst, {
          enter(path4) {
            if (path4.isJSXOpeningElement()) {
              const openingNode = path4.node;
              const elementNode = path4.parentPath.node;
              if (!openingNode.loc) {
                return;
              }
              const alreadyHasId = openingNode.attributes.some(
                (attr) => t.isJSXAttribute(attr) && attr.name.name === "data-edit-id"
              );
              if (alreadyHasId) {
                return;
              }
              const isCurrentElementEditable = checkTagNameEditable(openingNode, EDITABLE_HTML_TAGS);
              if (!isCurrentElementEditable) {
                return;
              }
              const imageValidation = validateImageSrc(openingNode);
              if (!imageValidation.isValid) {
                const disabledAttribute = t.jsxAttribute(
                  t.jsxIdentifier("data-edit-disabled"),
                  t.stringLiteral("true")
                );
                openingNode.attributes.push(disabledAttribute);
                attributesAdded++;
                return;
              }
              let shouldBeDisabledDueToChildren = false;
              if (t.isJSXElement(elementNode) && elementNode.children) {
                const hasPropsSpread = openingNode.attributes.some(
                  (attr) => t.isJSXSpreadAttribute(attr) && attr.argument && t.isIdentifier(attr.argument) && attr.argument.name === "props"
                );
                const hasDynamicChild = elementNode.children.some(
                  (child) => t.isJSXExpressionContainer(child)
                );
                if (hasDynamicChild || hasPropsSpread) {
                  shouldBeDisabledDueToChildren = true;
                }
              }
              if (!shouldBeDisabledDueToChildren && t.isJSXElement(elementNode) && elementNode.children) {
                const hasEditableJsxChild = elementNode.children.some((child) => {
                  if (t.isJSXElement(child)) {
                    return checkTagNameEditable(child.openingElement, EDITABLE_HTML_TAGS);
                  }
                  return false;
                });
                if (hasEditableJsxChild) {
                  shouldBeDisabledDueToChildren = true;
                }
              }
              if (shouldBeDisabledDueToChildren) {
                const disabledAttribute = t.jsxAttribute(
                  t.jsxIdentifier("data-edit-disabled"),
                  t.stringLiteral("true")
                );
                openingNode.attributes.push(disabledAttribute);
                attributesAdded++;
                return;
              }
              if (t.isJSXElement(elementNode) && elementNode.children && elementNode.children.length > 0) {
                let hasNonEditableJsxChild = false;
                for (const child of elementNode.children) {
                  if (t.isJSXElement(child)) {
                    if (!checkTagNameEditable(child.openingElement, EDITABLE_HTML_TAGS)) {
                      hasNonEditableJsxChild = true;
                      break;
                    }
                  }
                }
                if (hasNonEditableJsxChild) {
                  const disabledAttribute = t.jsxAttribute(
                    t.jsxIdentifier("data-edit-disabled"),
                    t.stringLiteral("true")
                  );
                  openingNode.attributes.push(disabledAttribute);
                  attributesAdded++;
                  return;
                }
              }
              let currentAncestorCandidatePath = path4.parentPath.parentPath;
              while (currentAncestorCandidatePath) {
                const ancestorJsxElementPath = currentAncestorCandidatePath.isJSXElement() ? currentAncestorCandidatePath : currentAncestorCandidatePath.findParent((p) => p.isJSXElement());
                if (!ancestorJsxElementPath) {
                  break;
                }
                if (checkTagNameEditable(ancestorJsxElementPath.node.openingElement, EDITABLE_HTML_TAGS)) {
                  return;
                }
                currentAncestorCandidatePath = ancestorJsxElementPath.parentPath;
              }
              const line = openingNode.loc.start.line;
              const column = openingNode.loc.start.column + 1;
              const editId = `${webRelativeFilePath}:${line}:${column}`;
              const idAttribute = t.jsxAttribute(
                t.jsxIdentifier("data-edit-id"),
                t.stringLiteral(editId)
              );
              openingNode.attributes.push(idAttribute);
              attributesAdded++;
            }
          }
        });
        if (attributesAdded > 0) {
          const output = generateSourceWithMap(babelAst, webRelativeFilePath, code);
          return { code: output.code, map: output.map };
        }
        return null;
      } catch (error) {
        console.error(`[vite][visual-editor] Error transforming ${id}:`, error);
        return null;
      }
    },
    // Updates source code based on the changes received from the client
    configureServer(server) {
      server.middlewares.use("/api/apply-edit", async (req, res, next) => {
        if (req.method !== "POST")
          return next();
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          var _a;
          let absoluteFilePath = "";
          try {
            const { editId, newFullText } = JSON.parse(body);
            if (!editId || typeof newFullText === "undefined") {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Missing editId or newFullText" }));
            }
            const parsedId = parseEditId(editId);
            if (!parsedId) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Invalid editId format (filePath:line:column)" }));
            }
            const { filePath, line, column } = parsedId;
            const validation = validateFilePath(filePath);
            if (!validation.isValid) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: validation.error }));
            }
            absoluteFilePath = validation.absolutePath;
            const originalContent = fs2.readFileSync(absoluteFilePath, "utf-8");
            const babelAst = parseFileToAST(absoluteFilePath);
            const targetNodePath = findJSXElementAtPosition(babelAst, line, column + 1);
            if (!targetNodePath) {
              res.writeHead(404, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Target node not found by line/column", editId }));
            }
            const targetOpeningElement = targetNodePath.node;
            const parentElementNode = (_a = targetNodePath.parentPath) == null ? void 0 : _a.node;
            const isImageElement = targetOpeningElement.name && targetOpeningElement.name.name === "img";
            let beforeCode = "";
            let afterCode = "";
            let modified = false;
            if (isImageElement) {
              beforeCode = generateCode(targetOpeningElement);
              const srcAttr = targetOpeningElement.attributes.find(
                (attr) => t.isJSXAttribute(attr) && attr.name && attr.name.name === "src"
              );
              if (srcAttr && t.isStringLiteral(srcAttr.value)) {
                srcAttr.value = t.stringLiteral(newFullText);
                modified = true;
                afterCode = generateCode(targetOpeningElement);
              }
            } else {
              if (parentElementNode && t.isJSXElement(parentElementNode)) {
                beforeCode = generateCode(parentElementNode);
                parentElementNode.children = [];
                if (newFullText && newFullText.trim() !== "") {
                  const newTextNode = t.jsxText(newFullText);
                  parentElementNode.children.push(newTextNode);
                }
                modified = true;
                afterCode = generateCode(parentElementNode);
              }
            }
            if (!modified) {
              res.writeHead(409, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Could not apply changes to AST." }));
            }
            const webRelativeFilePath = path2.relative(VITE_PROJECT_ROOT, absoluteFilePath).split(path2.sep).join("/");
            const output = generateSourceWithMap(babelAst, webRelativeFilePath, originalContent);
            const newContent = output.code;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              success: true,
              newFileContent: newContent,
              beforeCode,
              afterCode
            }));
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error during edit application." }));
          }
        });
      });
    }
  };
}

// plugins/visual-editor/vite-plugin-edit-mode.js
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// plugins/visual-editor/visual-editor-config.js
var EDIT_MODE_STYLES = `
	#root[data-edit-mode-enabled="true"] [data-edit-id] {
		cursor: pointer; 
		outline: 2px dashed #357DF9; 
		outline-offset: 2px;
		min-height: 1em;
	}
	#root[data-edit-mode-enabled="true"] img[data-edit-id] {
		outline-offset: -2px;
	}
	#root[data-edit-mode-enabled="true"] {
		cursor: pointer;
	}
	#root[data-edit-mode-enabled="true"] [data-edit-id]:hover {
		background-color: #357DF933;
		outline-color: #357DF9; 
	}

	@keyframes fadeInTooltip {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	#inline-editor-disabled-tooltip {
		display: none; 
		opacity: 0; 
		position: absolute;
		background-color: #1D1E20;
		color: white;
		padding: 4px 8px;
		border-radius: 8px;
		z-index: 10001;
		font-size: 14px;
		border: 1px solid #3B3D4A;
		max-width: 184px;
		text-align: center;
	}

	#inline-editor-disabled-tooltip.tooltip-active {
		display: block;
		animation: fadeInTooltip 0.2s ease-out forwards;
	}
`;

// plugins/visual-editor/vite-plugin-edit-mode.js
var __vite_injected_original_import_meta_url2 = "file:///C:/Users/Usuario/prospera-pages/plugins/visual-editor/vite-plugin-edit-mode.js";
var __filename2 = fileURLToPath2(__vite_injected_original_import_meta_url2);
var __dirname3 = resolve(__filename2, "..");
function inlineEditDevPlugin() {
  return {
    name: "vite:inline-edit-dev",
    apply: "serve",
    transformIndexHtml() {
      const scriptPath = resolve(__dirname3, "edit-mode-script.js");
      const scriptContent = readFileSync(scriptPath, "utf-8");
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: scriptContent,
          injectTo: "body"
        },
        {
          tag: "style",
          children: EDIT_MODE_STYLES,
          injectTo: "head"
        }
      ];
    }
  };
}

// plugins/vite-plugin-iframe-route-restoration.js
function iframeRouteRestorationPlugin() {
  return {
    name: "vite:iframe-route-restoration",
    apply: "serve",
    transformIndexHtml() {
      const script = `
      const ALLOWED_PARENT_ORIGINS = [
          "https://horizons.hostinger.com",
          "https://horizons.hostinger.dev",
          "https://horizons-frontend-local.hostinger.dev",
      ];

        // Check to see if the page is in an iframe
        if (window.self !== window.top) {
          const STORAGE_KEY = 'horizons-iframe-saved-route';

          const getCurrentRoute = () => location.pathname + location.search + location.hash;

          const save = () => {
            try {
              const currentRoute = getCurrentRoute();
              sessionStorage.setItem(STORAGE_KEY, currentRoute);
              window.parent.postMessage({message: 'route-changed', route: currentRoute}, '*');
            } catch {}
          };

          const replaceHistoryState = (url) => {
            try {
              history.replaceState(null, '', url);
              window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
              return true;
            } catch {}
            return false;
          };

          const restore = () => {
            try {
              const saved = sessionStorage.getItem(STORAGE_KEY);
              if (!saved) return;

              if (!saved.startsWith('/')) {
                sessionStorage.removeItem(STORAGE_KEY);
                return;
              }

              const current = getCurrentRoute();
              if (current !== saved) {
                if (!replaceHistoryState(saved)) {
                  replaceHistoryState('/');
                }

                requestAnimationFrame(() => setTimeout(() => {
                  try {
                    const text = (document.body?.innerText || '').trim();

                    // If the restored route results in too little content, assume it is invalid and navigate home
                    if (text.length < 50) {
                      replaceHistoryState('/');
                    }
                  } catch {}
                }, 1000));
              }
            } catch {}
          };

          const originalPushState = history.pushState;
          history.pushState = function(...args) {
            originalPushState.apply(this, args);
            save();
          };

          const originalReplaceState = history.replaceState;
          history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            save();
          };

          const getParentOrigin = () => {
              if (
                  window.location.ancestorOrigins &&
                  window.location.ancestorOrigins.length > 0
              ) {
                  return window.location.ancestorOrigins[0];
              }

              if (document.referrer) {
                  try {
                      return new URL(document.referrer).origin;
                  } catch (e) {
                      console.warn("Invalid referrer URL:", document.referrer);
                  }
              }

              return null;
          };

          window.addEventListener('popstate', save);
          window.addEventListener('hashchange', save);
          window.addEventListener("message", function (event) {
              const parentOrigin = getParentOrigin();

              if (event.data?.type === "redirect-home" && parentOrigin && ALLOWED_PARENT_ORIGINS.includes(parentOrigin)) {
                const saved = sessionStorage.getItem(STORAGE_KEY);

                if(saved && saved !== '/') {
                  replaceHistoryState('/')
                }
              }
          });

          restore();
        }
      `;
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: script,
          injectTo: "head"
        }
      ];
    }
  };
}

// plugins/selection-mode/vite-plugin-selection-mode.js
import { readFileSync as readFileSync2 } from "node:fs";
import { resolve as resolve2 } from "node:path";
import { fileURLToPath as fileURLToPath3 } from "node:url";
var __vite_injected_original_import_meta_url3 = "file:///C:/Users/Usuario/prospera-pages/plugins/selection-mode/vite-plugin-selection-mode.js";
var __filename3 = fileURLToPath3(__vite_injected_original_import_meta_url3);
var __dirname4 = resolve2(__filename3, "..");
function selectionModePlugin() {
  return {
    name: "vite:selection-mode",
    apply: "serve",
    transformIndexHtml() {
      const scriptPath = resolve2(__dirname4, "selection-mode-script.js");
      const scriptContent = readFileSync2(scriptPath, "utf-8");
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: scriptContent,
          injectTo: "body"
        }
      ];
    }
  };
}

// vite.config.js
var __vite_injected_original_dirname = "C:\\Users\\Usuario\\prospera-pages";
var isDev = process.env.NODE_ENV !== "production";
var configHorizonsViteErrorHandler = `
const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const addedNode of mutation.addedNodes) {
			if (
				addedNode.nodeType === Node.ELEMENT_NODE &&
				(
					addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
					addedNode.classList?.contains('backdrop')
				)
			) {
				handleViteOverlay(addedNode);
			}
		}
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

function handleViteOverlay(node) {
	if (!node.shadowRoot) {
		return;
	}

	const backdrop = node.shadowRoot.querySelector('.backdrop');

	if (backdrop) {
		const overlayHtml = backdrop.outerHTML;
		const parser = new DOMParser();
		const doc = parser.parseFromString(overlayHtml, 'text/html');
		const messageBodyElement = doc.querySelector('.message-body');
		const fileElement = doc.querySelector('.file');
		const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
		const fileText = fileElement ? fileElement.textContent.trim() : '';
		const error = messageText + (fileText ? ' File:' + fileText : '');

		window.parent.postMessage({
			type: 'horizons-vite-error',
			error,
		}, '*');
	}
}
`;
var configHorizonsRuntimeErrorHandler = `
window.onerror = (message, source, lineno, colno, errorObj) => {
	const errorDetails = errorObj ? JSON.stringify({
		name: errorObj.name,
		message: errorObj.message,
		stack: errorObj.stack,
		source,
		lineno,
		colno,
	}) : null;

	window.parent.postMessage({
		type: 'horizons-runtime-error',
		message,
		error: errorDetails
	}, '*');
};
`;
var configHorizonsConsoleErrroHandler = `
const originalConsoleError = console.error;
console.error = function(...args) {
	originalConsoleError.apply(console, args);

	let errorString = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg instanceof Error) {
			errorString = arg.stack || \`\${arg.name}: \${arg.message}\`;
			break;
		}
	}

	if (!errorString) {
		errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
	}

	window.parent.postMessage({
		type: 'horizons-console-error',
		error: errorString
	}, '*');
};
`;
var configWindowFetchMonkeyPatch = `
const originalFetch = window.fetch;

window.fetch = function(...args) {
	const url = args[0] instanceof Request ? args[0].url : args[0];

	// Skip WebSocket URLs
	if (url.startsWith('ws:') || url.startsWith('wss:')) {
		return originalFetch.apply(this, args);
	}

	return originalFetch.apply(this, args)
		.then(async response => {
			const contentType = response.headers.get('Content-Type') || '';

			// Exclude HTML document responses
			const isDocumentResponse =
				contentType.includes('text/html') ||
				contentType.includes('application/xhtml+xml');

			if (!response.ok && !isDocumentResponse) {
					const responseClone = response.clone();
					const errorFromRes = await responseClone.text();
					const requestUrl = response.url;
					console.error(\`Fetch error from \${requestUrl}: \${errorFromRes}\`);
			}

			return response;
		})
		.catch(error => {
			if (!url.match(/.html?$/i)) {
				console.error(error);
			}

			throw error;
		});
};
`;
var configNavigationHandler = `
if (window.navigation && window.self !== window.top) {
	window.navigation.addEventListener('navigate', (event) => {
		const url = event.destination.url;

		try {
			const destinationUrl = new URL(url);
			const destinationOrigin = destinationUrl.origin;
			const currentOrigin = window.location.origin;

			if (destinationOrigin === currentOrigin) {
				return;
			}
		} catch (error) {
			return;
		}

		window.parent.postMessage({
			type: 'horizons-navigation-error',
			url,
		}, '*');
	});
}
`;
var addTransformIndexHtml = {
  name: "add-transform-index-html",
  transformIndexHtml(html) {
    const tags = [
      {
        tag: "script",
        attrs: { type: "module" },
        children: configHorizonsRuntimeErrorHandler,
        injectTo: "head"
      },
      {
        tag: "script",
        attrs: { type: "module" },
        children: configHorizonsViteErrorHandler,
        injectTo: "head"
      },
      {
        tag: "script",
        attrs: { type: "module" },
        children: configHorizonsConsoleErrroHandler,
        injectTo: "head"
      },
      {
        tag: "script",
        attrs: { type: "module" },
        children: configWindowFetchMonkeyPatch,
        injectTo: "head"
      },
      {
        tag: "script",
        attrs: { type: "module" },
        children: configNavigationHandler,
        injectTo: "head"
      }
    ];
    if (!isDev && process.env.TEMPLATE_BANNER_SCRIPT_URL && process.env.TEMPLATE_REDIRECT_URL) {
      tags.push(
        {
          tag: "script",
          attrs: {
            src: process.env.TEMPLATE_BANNER_SCRIPT_URL,
            "template-redirect-url": process.env.TEMPLATE_REDIRECT_URL
          },
          injectTo: "head"
        }
      );
    }
    return {
      html,
      tags
    };
  }
};
console.warn = () => {
};
var logger = createLogger();
var loggerError = logger.error;
logger.error = (msg, options) => {
  var _a;
  if ((_a = options == null ? void 0 : options.error) == null ? void 0 : _a.toString().includes("CssSyntaxError: [postcss]")) {
    return;
  }
  loggerError(msg, options);
};
var vite_config_default = defineConfig({
  customLogger: logger,
  plugins: [
    ...isDev ? [inlineEditPlugin(), inlineEditDevPlugin(), iframeRouteRestorationPlugin(), selectionModePlugin()] : [],
    react(),
    addTransformIndexHtml
  ],
  server: {
    cors: true,
    headers: {
      "Cross-Origin-Embedder-Policy": "credentialless"
    },
    allowedHosts: true,
    proxy: {
      "/webhook-test": {
        target: "https://prospera-n8n.34eiwn.easypanel.host",
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
    alias: {
      "@": path3.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      external: [
        "@babel/parser",
        "@babel/traverse",
        "@babel/generator",
        "@babel/types"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicGx1Z2lucy92aXN1YWwtZWRpdG9yL3ZpdGUtcGx1Z2luLXJlYWN0LWlubGluZS1lZGl0b3IuanMiLCAicGx1Z2lucy91dGlscy9hc3QtdXRpbHMuanMiLCAicGx1Z2lucy92aXN1YWwtZWRpdG9yL3ZpdGUtcGx1Z2luLWVkaXQtbW9kZS5qcyIsICJwbHVnaW5zL3Zpc3VhbC1lZGl0b3IvdmlzdWFsLWVkaXRvci1jb25maWcuanMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1pZnJhbWUtcm91dGUtcmVzdG9yYXRpb24uanMiLCAicGx1Z2lucy9zZWxlY3Rpb24tbW9kZS92aXRlLXBsdWdpbi1zZWxlY3Rpb24tbW9kZS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzdWFyaW9cXFxccHJvc3BlcmEtcGFnZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzdWFyaW9cXFxccHJvc3BlcmEtcGFnZXNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzdWFyaW8vcHJvc3BlcmEtcGFnZXMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgaW5saW5lRWRpdFBsdWdpbiBmcm9tICcuL3BsdWdpbnMvdmlzdWFsLWVkaXRvci92aXRlLXBsdWdpbi1yZWFjdC1pbmxpbmUtZWRpdG9yLmpzJztcclxuaW1wb3J0IGVkaXRNb2RlRGV2UGx1Z2luIGZyb20gJy4vcGx1Z2lucy92aXN1YWwtZWRpdG9yL3ZpdGUtcGx1Z2luLWVkaXQtbW9kZS5qcyc7XHJcbmltcG9ydCBpZnJhbWVSb3V0ZVJlc3RvcmF0aW9uUGx1Z2luIGZyb20gJy4vcGx1Z2lucy92aXRlLXBsdWdpbi1pZnJhbWUtcm91dGUtcmVzdG9yYXRpb24uanMnO1xyXG5pbXBvcnQgc2VsZWN0aW9uTW9kZVBsdWdpbiBmcm9tICcuL3BsdWdpbnMvc2VsZWN0aW9uLW1vZGUvdml0ZS1wbHVnaW4tc2VsZWN0aW9uLW1vZGUuanMnO1xyXG5cclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nO1xyXG5cclxuY29uc3QgY29uZmlnSG9yaXpvbnNWaXRlRXJyb3JIYW5kbGVyID0gYFxyXG5jb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcclxuXHRmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xyXG5cdFx0Zm9yIChjb25zdCBhZGRlZE5vZGUgb2YgbXV0YXRpb24uYWRkZWROb2Rlcykge1xyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0YWRkZWROb2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJlxyXG5cdFx0XHRcdChcclxuXHRcdFx0XHRcdGFkZGVkTm9kZS50YWdOYW1lPy50b0xvd2VyQ2FzZSgpID09PSAndml0ZS1lcnJvci1vdmVybGF5JyB8fFxyXG5cdFx0XHRcdFx0YWRkZWROb2RlLmNsYXNzTGlzdD8uY29udGFpbnMoJ2JhY2tkcm9wJylcclxuXHRcdFx0XHQpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGhhbmRsZVZpdGVPdmVybGF5KGFkZGVkTm9kZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxub2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcclxuXHRjaGlsZExpc3Q6IHRydWUsXHJcblx0c3VidHJlZTogdHJ1ZVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVZpdGVPdmVybGF5KG5vZGUpIHtcclxuXHRpZiAoIW5vZGUuc2hhZG93Um9vdCkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgYmFja2Ryb3AgPSBub2RlLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignLmJhY2tkcm9wJyk7XHJcblxyXG5cdGlmIChiYWNrZHJvcCkge1xyXG5cdFx0Y29uc3Qgb3ZlcmxheUh0bWwgPSBiYWNrZHJvcC5vdXRlckhUTUw7XHJcblx0XHRjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcblx0XHRjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKG92ZXJsYXlIdG1sLCAndGV4dC9odG1sJyk7XHJcblx0XHRjb25zdCBtZXNzYWdlQm9keUVsZW1lbnQgPSBkb2MucXVlcnlTZWxlY3RvcignLm1lc3NhZ2UtYm9keScpO1xyXG5cdFx0Y29uc3QgZmlsZUVsZW1lbnQgPSBkb2MucXVlcnlTZWxlY3RvcignLmZpbGUnKTtcclxuXHRcdGNvbnN0IG1lc3NhZ2VUZXh0ID0gbWVzc2FnZUJvZHlFbGVtZW50ID8gbWVzc2FnZUJvZHlFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKSA6ICcnO1xyXG5cdFx0Y29uc3QgZmlsZVRleHQgPSBmaWxlRWxlbWVudCA/IGZpbGVFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKSA6ICcnO1xyXG5cdFx0Y29uc3QgZXJyb3IgPSBtZXNzYWdlVGV4dCArIChmaWxlVGV4dCA/ICcgRmlsZTonICsgZmlsZVRleHQgOiAnJyk7XHJcblxyXG5cdFx0d2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdHR5cGU6ICdob3Jpem9ucy12aXRlLWVycm9yJyxcclxuXHRcdFx0ZXJyb3IsXHJcblx0XHR9LCAnKicpO1xyXG5cdH1cclxufVxyXG5gO1xyXG5cclxuY29uc3QgY29uZmlnSG9yaXpvbnNSdW50aW1lRXJyb3JIYW5kbGVyID0gYFxyXG53aW5kb3cub25lcnJvciA9IChtZXNzYWdlLCBzb3VyY2UsIGxpbmVubywgY29sbm8sIGVycm9yT2JqKSA9PiB7XHJcblx0Y29uc3QgZXJyb3JEZXRhaWxzID0gZXJyb3JPYmogPyBKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRuYW1lOiBlcnJvck9iai5uYW1lLFxyXG5cdFx0bWVzc2FnZTogZXJyb3JPYmoubWVzc2FnZSxcclxuXHRcdHN0YWNrOiBlcnJvck9iai5zdGFjayxcclxuXHRcdHNvdXJjZSxcclxuXHRcdGxpbmVubyxcclxuXHRcdGNvbG5vLFxyXG5cdH0pIDogbnVsbDtcclxuXHJcblx0d2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XHJcblx0XHR0eXBlOiAnaG9yaXpvbnMtcnVudGltZS1lcnJvcicsXHJcblx0XHRtZXNzYWdlLFxyXG5cdFx0ZXJyb3I6IGVycm9yRGV0YWlsc1xyXG5cdH0sICcqJyk7XHJcbn07XHJcbmA7XHJcblxyXG5jb25zdCBjb25maWdIb3Jpem9uc0NvbnNvbGVFcnJyb0hhbmRsZXIgPSBgXHJcbmNvbnN0IG9yaWdpbmFsQ29uc29sZUVycm9yID0gY29uc29sZS5lcnJvcjtcclxuY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuXHRvcmlnaW5hbENvbnNvbGVFcnJvci5hcHBseShjb25zb2xlLCBhcmdzKTtcclxuXHJcblx0bGV0IGVycm9yU3RyaW5nID0gJyc7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y29uc3QgYXJnID0gYXJnc1tpXTtcclxuXHRcdGlmIChhcmcgaW5zdGFuY2VvZiBFcnJvcikge1xyXG5cdFx0XHRlcnJvclN0cmluZyA9IGFyZy5zdGFjayB8fCBcXGBcXCR7YXJnLm5hbWV9OiBcXCR7YXJnLm1lc3NhZ2V9XFxgO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICghZXJyb3JTdHJpbmcpIHtcclxuXHRcdGVycm9yU3RyaW5nID0gYXJncy5tYXAoYXJnID0+IHR5cGVvZiBhcmcgPT09ICdvYmplY3QnID8gSlNPTi5zdHJpbmdpZnkoYXJnKSA6IFN0cmluZyhhcmcpKS5qb2luKCcgJyk7XHJcblx0fVxyXG5cclxuXHR3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHtcclxuXHRcdHR5cGU6ICdob3Jpem9ucy1jb25zb2xlLWVycm9yJyxcclxuXHRcdGVycm9yOiBlcnJvclN0cmluZ1xyXG5cdH0sICcqJyk7XHJcbn07XHJcbmA7XHJcblxyXG5jb25zdCBjb25maWdXaW5kb3dGZXRjaE1vbmtleVBhdGNoID0gYFxyXG5jb25zdCBvcmlnaW5hbEZldGNoID0gd2luZG93LmZldGNoO1xyXG5cclxud2luZG93LmZldGNoID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG5cdGNvbnN0IHVybCA9IGFyZ3NbMF0gaW5zdGFuY2VvZiBSZXF1ZXN0ID8gYXJnc1swXS51cmwgOiBhcmdzWzBdO1xyXG5cclxuXHQvLyBTa2lwIFdlYlNvY2tldCBVUkxzXHJcblx0aWYgKHVybC5zdGFydHNXaXRoKCd3czonKSB8fCB1cmwuc3RhcnRzV2l0aCgnd3NzOicpKSB7XHJcblx0XHRyZXR1cm4gb3JpZ2luYWxGZXRjaC5hcHBseSh0aGlzLCBhcmdzKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBvcmlnaW5hbEZldGNoLmFwcGx5KHRoaXMsIGFyZ3MpXHJcblx0XHQudGhlbihhc3luYyByZXNwb25zZSA9PiB7XHJcblx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnO1xyXG5cclxuXHRcdFx0Ly8gRXhjbHVkZSBIVE1MIGRvY3VtZW50IHJlc3BvbnNlc1xyXG5cdFx0XHRjb25zdCBpc0RvY3VtZW50UmVzcG9uc2UgPVxyXG5cdFx0XHRcdGNvbnRlbnRUeXBlLmluY2x1ZGVzKCd0ZXh0L2h0bWwnKSB8fFxyXG5cdFx0XHRcdGNvbnRlbnRUeXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi94aHRtbCt4bWwnKTtcclxuXHJcblx0XHRcdGlmICghcmVzcG9uc2Uub2sgJiYgIWlzRG9jdW1lbnRSZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2VDbG9uZSA9IHJlc3BvbnNlLmNsb25lKCk7XHJcblx0XHRcdFx0XHRjb25zdCBlcnJvckZyb21SZXMgPSBhd2FpdCByZXNwb25zZUNsb25lLnRleHQoKTtcclxuXHRcdFx0XHRcdGNvbnN0IHJlcXVlc3RVcmwgPSByZXNwb25zZS51cmw7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFxcYEZldGNoIGVycm9yIGZyb20gXFwke3JlcXVlc3RVcmx9OiBcXCR7ZXJyb3JGcm9tUmVzfVxcYCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByZXNwb25zZTtcclxuXHRcdH0pXHJcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xyXG5cdFx0XHRpZiAoIXVybC5tYXRjaCgvXFwuaHRtbD8kL2kpKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRocm93IGVycm9yO1xyXG5cdFx0fSk7XHJcbn07XHJcbmA7XHJcblxyXG5jb25zdCBjb25maWdOYXZpZ2F0aW9uSGFuZGxlciA9IGBcclxuaWYgKHdpbmRvdy5uYXZpZ2F0aW9uICYmIHdpbmRvdy5zZWxmICE9PSB3aW5kb3cudG9wKSB7XHJcblx0d2luZG93Lm5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignbmF2aWdhdGUnLCAoZXZlbnQpID0+IHtcclxuXHRcdGNvbnN0IHVybCA9IGV2ZW50LmRlc3RpbmF0aW9uLnVybDtcclxuXHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBkZXN0aW5hdGlvblVybCA9IG5ldyBVUkwodXJsKTtcclxuXHRcdFx0Y29uc3QgZGVzdGluYXRpb25PcmlnaW4gPSBkZXN0aW5hdGlvblVybC5vcmlnaW47XHJcblx0XHRcdGNvbnN0IGN1cnJlbnRPcmlnaW4gPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG5cclxuXHRcdFx0aWYgKGRlc3RpbmF0aW9uT3JpZ2luID09PSBjdXJyZW50T3JpZ2luKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0d2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdHR5cGU6ICdob3Jpem9ucy1uYXZpZ2F0aW9uLWVycm9yJyxcclxuXHRcdFx0dXJsLFxyXG5cdFx0fSwgJyonKTtcclxuXHR9KTtcclxufVxyXG5gO1xyXG5cclxuY29uc3QgYWRkVHJhbnNmb3JtSW5kZXhIdG1sID0ge1xyXG5cdG5hbWU6ICdhZGQtdHJhbnNmb3JtLWluZGV4LWh0bWwnLFxyXG5cdHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XHJcblx0XHRjb25zdCB0YWdzID0gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGFnOiAnc2NyaXB0JyxcclxuXHRcdFx0XHRhdHRyczogeyB0eXBlOiAnbW9kdWxlJyB9LFxyXG5cdFx0XHRcdGNoaWxkcmVuOiBjb25maWdIb3Jpem9uc1J1bnRpbWVFcnJvckhhbmRsZXIsXHJcblx0XHRcdFx0aW5qZWN0VG86ICdoZWFkJyxcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRhZzogJ3NjcmlwdCcsXHJcblx0XHRcdFx0YXR0cnM6IHsgdHlwZTogJ21vZHVsZScgfSxcclxuXHRcdFx0XHRjaGlsZHJlbjogY29uZmlnSG9yaXpvbnNWaXRlRXJyb3JIYW5kbGVyLFxyXG5cdFx0XHRcdGluamVjdFRvOiAnaGVhZCcsXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0YWc6ICdzY3JpcHQnLFxyXG5cdFx0XHRcdGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnIH0sXHJcblx0XHRcdFx0Y2hpbGRyZW46IGNvbmZpZ0hvcml6b25zQ29uc29sZUVycnJvSGFuZGxlcixcclxuXHRcdFx0XHRpbmplY3RUbzogJ2hlYWQnLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGFnOiAnc2NyaXB0JyxcclxuXHRcdFx0XHRhdHRyczogeyB0eXBlOiAnbW9kdWxlJyB9LFxyXG5cdFx0XHRcdGNoaWxkcmVuOiBjb25maWdXaW5kb3dGZXRjaE1vbmtleVBhdGNoLFxyXG5cdFx0XHRcdGluamVjdFRvOiAnaGVhZCcsXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0YWc6ICdzY3JpcHQnLFxyXG5cdFx0XHRcdGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnIH0sXHJcblx0XHRcdFx0Y2hpbGRyZW46IGNvbmZpZ05hdmlnYXRpb25IYW5kbGVyLFxyXG5cdFx0XHRcdGluamVjdFRvOiAnaGVhZCcsXHJcblx0XHRcdH0sXHJcblx0XHRdO1xyXG5cclxuXHRcdGlmICghaXNEZXYgJiYgcHJvY2Vzcy5lbnYuVEVNUExBVEVfQkFOTkVSX1NDUklQVF9VUkwgJiYgcHJvY2Vzcy5lbnYuVEVNUExBVEVfUkVESVJFQ1RfVVJMKSB7XHJcblx0XHRcdHRhZ3MucHVzaChcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0YWc6ICdzY3JpcHQnLFxyXG5cdFx0XHRcdFx0YXR0cnM6IHtcclxuXHRcdFx0XHRcdFx0c3JjOiBwcm9jZXNzLmVudi5URU1QTEFURV9CQU5ORVJfU0NSSVBUX1VSTCxcclxuXHRcdFx0XHRcdFx0J3RlbXBsYXRlLXJlZGlyZWN0LXVybCc6IHByb2Nlc3MuZW52LlRFTVBMQVRFX1JFRElSRUNUX1VSTCxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRpbmplY3RUbzogJ2hlYWQnLFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRodG1sLFxyXG5cdFx0XHR0YWdzLFxyXG5cdFx0fTtcclxuXHR9LFxyXG59O1xyXG5cclxuY29uc29sZS53YXJuID0gKCkgPT4geyB9O1xyXG5cclxuY29uc3QgbG9nZ2VyID0gY3JlYXRlTG9nZ2VyKClcclxuY29uc3QgbG9nZ2VyRXJyb3IgPSBsb2dnZXIuZXJyb3JcclxuXHJcbmxvZ2dlci5lcnJvciA9IChtc2csIG9wdGlvbnMpID0+IHtcclxuXHRpZiAob3B0aW9ucz8uZXJyb3I/LnRvU3RyaW5nKCkuaW5jbHVkZXMoJ0Nzc1N5bnRheEVycm9yOiBbcG9zdGNzc10nKSkge1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0bG9nZ2VyRXJyb3IobXNnLCBvcHRpb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRjdXN0b21Mb2dnZXI6IGxvZ2dlcixcclxuXHRwbHVnaW5zOiBbXHJcblx0XHQuLi4oaXNEZXYgPyBbaW5saW5lRWRpdFBsdWdpbigpLCBlZGl0TW9kZURldlBsdWdpbigpLCBpZnJhbWVSb3V0ZVJlc3RvcmF0aW9uUGx1Z2luKCksIHNlbGVjdGlvbk1vZGVQbHVnaW4oKV0gOiBbXSksXHJcblx0XHRyZWFjdCgpLFxyXG5cdFx0YWRkVHJhbnNmb3JtSW5kZXhIdG1sXHJcblx0XSxcclxuXHRzZXJ2ZXI6IHtcclxuXHRcdGNvcnM6IHRydWUsXHJcblx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdCdDcm9zcy1PcmlnaW4tRW1iZWRkZXItUG9saWN5JzogJ2NyZWRlbnRpYWxsZXNzJyxcclxuXHRcdH0sXHJcblx0XHRhbGxvd2VkSG9zdHM6IHRydWUsXHJcblx0XHRwcm94eToge1xyXG5cdFx0XHQnL3dlYmhvb2stdGVzdCc6IHtcclxuXHRcdFx0XHR0YXJnZXQ6ICdodHRwczovL3Byb3NwZXJhLW44bi4zNGVpd24uZWFzeXBhbmVsLmhvc3QnLFxyXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuXHRcdFx0XHRzZWN1cmU6IGZhbHNlLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdHJlc29sdmU6IHtcclxuXHRcdGV4dGVuc2lvbnM6IFsnLmpzeCcsICcuanMnLCAnLnRzeCcsICcudHMnLCAnLmpzb24nLF0sXHJcblx0XHRhbGlhczoge1xyXG5cdFx0XHQnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRyb2xsdXBPcHRpb25zOiB7XHJcblx0XHRcdGV4dGVybmFsOiBbXHJcblx0XHRcdFx0J0BiYWJlbC9wYXJzZXInLFxyXG5cdFx0XHRcdCdAYmFiZWwvdHJhdmVyc2UnLFxyXG5cdFx0XHRcdCdAYmFiZWwvZ2VuZXJhdG9yJyxcclxuXHRcdFx0XHQnQGJhYmVsL3R5cGVzJ1xyXG5cdFx0XHRdXHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc3VhcmlvXFxcXHByb3NwZXJhLXBhZ2VzXFxcXHBsdWdpbnNcXFxcdmlzdWFsLWVkaXRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXN1YXJpb1xcXFxwcm9zcGVyYS1wYWdlc1xcXFxwbHVnaW5zXFxcXHZpc3VhbC1lZGl0b3JcXFxcdml0ZS1wbHVnaW4tcmVhY3QtaW5saW5lLWVkaXRvci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVXN1YXJpby9wcm9zcGVyYS1wYWdlcy9wbHVnaW5zL3Zpc3VhbC1lZGl0b3Ivdml0ZS1wbHVnaW4tcmVhY3QtaW5saW5lLWVkaXRvci5qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ0BiYWJlbC9wYXJzZXInO1xyXG5pbXBvcnQgdHJhdmVyc2VCYWJlbCBmcm9tICdAYmFiZWwvdHJhdmVyc2UnO1xyXG5pbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCB7IFxyXG5cdHZhbGlkYXRlRmlsZVBhdGgsIFxyXG5cdHBhcnNlRmlsZVRvQVNULCBcclxuXHRmaW5kSlNYRWxlbWVudEF0UG9zaXRpb24sXHJcblx0Z2VuZXJhdGVDb2RlLFxyXG5cdGdlbmVyYXRlU291cmNlV2l0aE1hcCxcclxuXHRWSVRFX1BST0pFQ1RfUk9PVFxyXG59IGZyb20gJy4uL3V0aWxzL2FzdC11dGlscy5qcyc7XHJcblxyXG5jb25zdCBFRElUQUJMRV9IVE1MX1RBR1MgPSBbXCJhXCIsIFwiQnV0dG9uXCIsIFwiYnV0dG9uXCIsIFwicFwiLCBcInNwYW5cIiwgXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwiaDZcIiwgXCJsYWJlbFwiLCBcIkxhYmVsXCIsIFwiaW1nXCJdO1xyXG5cclxuZnVuY3Rpb24gcGFyc2VFZGl0SWQoZWRpdElkKSB7XHJcblx0Y29uc3QgcGFydHMgPSBlZGl0SWQuc3BsaXQoJzonKTtcclxuXHJcblx0aWYgKHBhcnRzLmxlbmd0aCA8IDMpIHtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgY29sdW1uID0gcGFyc2VJbnQocGFydHMuYXQoLTEpLCAxMCk7XHJcblx0Y29uc3QgbGluZSA9IHBhcnNlSW50KHBhcnRzLmF0KC0yKSwgMTApO1xyXG5cdGNvbnN0IGZpbGVQYXRoID0gcGFydHMuc2xpY2UoMCwgLTIpLmpvaW4oJzonKTtcclxuXHJcblx0aWYgKCFmaWxlUGF0aCB8fCBpc05hTihsaW5lKSB8fCBpc05hTihjb2x1bW4pKSB7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7IGZpbGVQYXRoLCBsaW5lLCBjb2x1bW4gfTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tUYWdOYW1lRWRpdGFibGUob3BlbmluZ0VsZW1lbnROb2RlLCBlZGl0YWJsZVRhZ3NMaXN0KSB7XHJcblx0aWYgKCFvcGVuaW5nRWxlbWVudE5vZGUgfHwgIW9wZW5pbmdFbGVtZW50Tm9kZS5uYW1lKSByZXR1cm4gZmFsc2U7XHJcblx0Y29uc3QgbmFtZU5vZGUgPSBvcGVuaW5nRWxlbWVudE5vZGUubmFtZTtcclxuXHJcblx0Ly8gQ2hlY2sgMTogRGlyZWN0IG5hbWUgKGZvciA8cD4sIDxCdXR0b24+KVxyXG5cdGlmIChuYW1lTm9kZS50eXBlID09PSAnSlNYSWRlbnRpZmllcicgJiYgZWRpdGFibGVUYWdzTGlzdC5pbmNsdWRlcyhuYW1lTm9kZS5uYW1lKSkge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHQvLyBDaGVjayAyOiBQcm9wZXJ0eSBuYW1lIG9mIGEgbWVtYmVyIGV4cHJlc3Npb24gKGZvciA8bW90aW9uLmgxPiwgY2hlY2sgaWYgXCJoMVwiIGlzIGluIGVkaXRhYmxlVGFnc0xpc3QpXHJcblx0aWYgKG5hbWVOb2RlLnR5cGUgPT09ICdKU1hNZW1iZXJFeHByZXNzaW9uJyAmJiBuYW1lTm9kZS5wcm9wZXJ0eSAmJiBuYW1lTm9kZS5wcm9wZXJ0eS50eXBlID09PSAnSlNYSWRlbnRpZmllcicgJiYgZWRpdGFibGVUYWdzTGlzdC5pbmNsdWRlcyhuYW1lTm9kZS5wcm9wZXJ0eS5uYW1lKSkge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlSW1hZ2VTcmMob3BlbmluZ05vZGUpIHtcclxuXHRpZiAoIW9wZW5pbmdOb2RlIHx8ICFvcGVuaW5nTm9kZS5uYW1lIHx8IG9wZW5pbmdOb2RlLm5hbWUubmFtZSAhPT0gJ2ltZycpIHtcclxuXHRcdHJldHVybiB7IGlzVmFsaWQ6IHRydWUsIHJlYXNvbjogbnVsbCB9OyAvLyBOb3QgYW4gaW1hZ2UsIHNraXAgdmFsaWRhdGlvblxyXG5cdH1cclxuXHJcblx0Y29uc3QgaGFzUHJvcHNTcHJlYWQgPSBvcGVuaW5nTm9kZS5hdHRyaWJ1dGVzLnNvbWUoYXR0ciA9PlxyXG5cdFx0dC5pc0pTWFNwcmVhZEF0dHJpYnV0ZShhdHRyKSAmJlxyXG5cdFx0YXR0ci5hcmd1bWVudCAmJlxyXG5cdFx0dC5pc0lkZW50aWZpZXIoYXR0ci5hcmd1bWVudCkgJiZcclxuXHRcdGF0dHIuYXJndW1lbnQubmFtZSA9PT0gJ3Byb3BzJ1xyXG5cdCk7XHJcblxyXG5cdGlmIChoYXNQcm9wc1NwcmVhZCkge1xyXG5cdFx0cmV0dXJuIHsgaXNWYWxpZDogZmFsc2UsIHJlYXNvbjogJ3Byb3BzLXNwcmVhZCcgfTtcclxuXHR9XHJcblxyXG5cdGNvbnN0IHNyY0F0dHIgPSBvcGVuaW5nTm9kZS5hdHRyaWJ1dGVzLmZpbmQoYXR0ciA9PlxyXG5cdFx0dC5pc0pTWEF0dHJpYnV0ZShhdHRyKSAmJlxyXG5cdFx0YXR0ci5uYW1lICYmXHJcblx0XHRhdHRyLm5hbWUubmFtZSA9PT0gJ3NyYydcclxuXHQpO1xyXG5cclxuXHRpZiAoIXNyY0F0dHIpIHtcclxuXHRcdHJldHVybiB7IGlzVmFsaWQ6IGZhbHNlLCByZWFzb246ICdtaXNzaW5nLXNyYycgfTtcclxuXHR9XHJcblxyXG5cdGlmICghdC5pc1N0cmluZ0xpdGVyYWwoc3JjQXR0ci52YWx1ZSkpIHtcclxuXHRcdHJldHVybiB7IGlzVmFsaWQ6IGZhbHNlLCByZWFzb246ICdkeW5hbWljLXNyYycgfTtcclxuXHR9XHJcblxyXG5cdGlmICghc3JjQXR0ci52YWx1ZS52YWx1ZSB8fCBzcmNBdHRyLnZhbHVlLnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcclxuXHRcdHJldHVybiB7IGlzVmFsaWQ6IGZhbHNlLCByZWFzb246ICdlbXB0eS1zcmMnIH07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4geyBpc1ZhbGlkOiB0cnVlLCByZWFzb246IG51bGwgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5saW5lRWRpdFBsdWdpbigpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0bmFtZTogJ3ZpdGUtaW5saW5lLWVkaXQtcGx1Z2luJyxcclxuXHRcdGVuZm9yY2U6ICdwcmUnLFxyXG5cclxuXHRcdHRyYW5zZm9ybShjb2RlLCBpZCkge1xyXG5cdFx0XHRpZiAoIS9cXC4oanN4fHRzeCkkLy50ZXN0KGlkKSB8fCAhaWQuc3RhcnRzV2l0aChWSVRFX1BST0pFQ1RfUk9PVCkgfHwgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJlbGF0aXZlRmlsZVBhdGggPSBwYXRoLnJlbGF0aXZlKFZJVEVfUFJPSkVDVF9ST09ULCBpZCk7XHJcblx0XHRcdGNvbnN0IHdlYlJlbGF0aXZlRmlsZVBhdGggPSByZWxhdGl2ZUZpbGVQYXRoLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJyk7XHJcblxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGNvbnN0IGJhYmVsQXN0ID0gcGFyc2UoY29kZSwge1xyXG5cdFx0XHRcdFx0c291cmNlVHlwZTogJ21vZHVsZScsXHJcblx0XHRcdFx0XHRwbHVnaW5zOiBbJ2pzeCcsICd0eXBlc2NyaXB0J10sXHJcblx0XHRcdFx0XHRlcnJvclJlY292ZXJ5OiB0cnVlXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGxldCBhdHRyaWJ1dGVzQWRkZWQgPSAwO1xyXG5cclxuXHRcdFx0XHR0cmF2ZXJzZUJhYmVsLmRlZmF1bHQoYmFiZWxBc3QsIHtcclxuXHRcdFx0XHRcdGVudGVyKHBhdGgpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHBhdGguaXNKU1hPcGVuaW5nRWxlbWVudCgpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb3BlbmluZ05vZGUgPSBwYXRoLm5vZGU7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudE5vZGUgPSBwYXRoLnBhcmVudFBhdGgubm9kZTsgLy8gVGhlIEpTWEVsZW1lbnQgaXRzZWxmXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghb3BlbmluZ05vZGUubG9jKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRjb25zdCBhbHJlYWR5SGFzSWQgPSBvcGVuaW5nTm9kZS5hdHRyaWJ1dGVzLnNvbWUoXHJcblx0XHRcdFx0XHRcdFx0XHQoYXR0cikgPT4gdC5pc0pTWEF0dHJpYnV0ZShhdHRyKSAmJiBhdHRyLm5hbWUubmFtZSA9PT0gJ2RhdGEtZWRpdC1pZCdcclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoYWxyZWFkeUhhc0lkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBDb25kaXRpb24gMTogSXMgdGhlIGN1cnJlbnQgZWxlbWVudCB0YWcgdHlwZSBlZGl0YWJsZT9cclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpc0N1cnJlbnRFbGVtZW50RWRpdGFibGUgPSBjaGVja1RhZ05hbWVFZGl0YWJsZShvcGVuaW5nTm9kZSwgRURJVEFCTEVfSFRNTF9UQUdTKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIWlzQ3VycmVudEVsZW1lbnRFZGl0YWJsZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaW1hZ2VWYWxpZGF0aW9uID0gdmFsaWRhdGVJbWFnZVNyYyhvcGVuaW5nTm9kZSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFpbWFnZVZhbGlkYXRpb24uaXNWYWxpZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgZGlzYWJsZWRBdHRyaWJ1dGUgPSB0LmpzeEF0dHJpYnV0ZShcclxuXHRcdFx0XHRcdFx0XHRcdFx0dC5qc3hJZGVudGlmaWVyKCdkYXRhLWVkaXQtZGlzYWJsZWQnKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dC5zdHJpbmdMaXRlcmFsKCd0cnVlJylcclxuXHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRvcGVuaW5nTm9kZS5hdHRyaWJ1dGVzLnB1c2goZGlzYWJsZWRBdHRyaWJ1dGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0YXR0cmlidXRlc0FkZGVkKys7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRsZXQgc2hvdWxkQmVEaXNhYmxlZER1ZVRvQ2hpbGRyZW4gPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gQ29uZGl0aW9uIDI6IERvZXMgdGhlIGVsZW1lbnQgaGF2ZSBkeW5hbWljIG9yIGVkaXRhYmxlIGNoaWxkcmVuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHQuaXNKU1hFbGVtZW50KGVsZW1lbnROb2RlKSAmJiBlbGVtZW50Tm9kZS5jaGlsZHJlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgZWxlbWVudCBoYXMgey4uLnByb3BzfSBzcHJlYWQgYXR0cmlidXRlIC0gZGlzYWJsZSBlZGl0aW5nIGlmIGl0IGRvZXNcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGhhc1Byb3BzU3ByZWFkID0gb3BlbmluZ05vZGUuYXR0cmlidXRlcy5zb21lKGF0dHIgPT4gdC5pc0pTWFNwcmVhZEF0dHJpYnV0ZShhdHRyKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQmJiBhdHRyLmFyZ3VtZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCYmIHQuaXNJZGVudGlmaWVyKGF0dHIuYXJndW1lbnQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdCYmIGF0dHIuYXJndW1lbnQubmFtZSA9PT0gJ3Byb3BzJ1xyXG5cdFx0XHRcdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBoYXNEeW5hbWljQ2hpbGQgPSBlbGVtZW50Tm9kZS5jaGlsZHJlbi5zb21lKGNoaWxkID0+XHJcblx0XHRcdFx0XHRcdFx0XHRcdHQuaXNKU1hFeHByZXNzaW9uQ29udGFpbmVyKGNoaWxkKVxyXG5cdFx0XHRcdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoaGFzRHluYW1pY0NoaWxkIHx8IGhhc1Byb3BzU3ByZWFkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHNob3VsZEJlRGlzYWJsZWREdWVUb0NoaWxkcmVuID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghc2hvdWxkQmVEaXNhYmxlZER1ZVRvQ2hpbGRyZW4gJiYgdC5pc0pTWEVsZW1lbnQoZWxlbWVudE5vZGUpICYmIGVsZW1lbnROb2RlLmNoaWxkcmVuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBoYXNFZGl0YWJsZUpzeENoaWxkID0gZWxlbWVudE5vZGUuY2hpbGRyZW4uc29tZShjaGlsZCA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0LmlzSlNYRWxlbWVudChjaGlsZCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2hlY2tUYWdOYW1lRWRpdGFibGUoY2hpbGQub3BlbmluZ0VsZW1lbnQsIEVESVRBQkxFX0hUTUxfVEFHUyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmIChoYXNFZGl0YWJsZUpzeENoaWxkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHNob3VsZEJlRGlzYWJsZWREdWVUb0NoaWxkcmVuID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChzaG91bGRCZURpc2FibGVkRHVlVG9DaGlsZHJlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgZGlzYWJsZWRBdHRyaWJ1dGUgPSB0LmpzeEF0dHJpYnV0ZShcclxuXHRcdFx0XHRcdFx0XHRcdFx0dC5qc3hJZGVudGlmaWVyKCdkYXRhLWVkaXQtZGlzYWJsZWQnKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dC5zdHJpbmdMaXRlcmFsKCd0cnVlJylcclxuXHRcdFx0XHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0b3BlbmluZ05vZGUuYXR0cmlidXRlcy5wdXNoKGRpc2FibGVkQXR0cmlidXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdGF0dHJpYnV0ZXNBZGRlZCsrO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gQ29uZGl0aW9uIDM6IFBhcmVudCBpcyBub24tZWRpdGFibGUgaWYgQVQgTEVBU1QgT05FIGNoaWxkIEpTWEVsZW1lbnQgaXMgYSBub24tZWRpdGFibGUgdHlwZS5cclxuXHRcdFx0XHRcdFx0XHRpZiAodC5pc0pTWEVsZW1lbnQoZWxlbWVudE5vZGUpICYmIGVsZW1lbnROb2RlLmNoaWxkcmVuICYmIGVsZW1lbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBoYXNOb25FZGl0YWJsZUpzeENoaWxkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGNvbnN0IGNoaWxkIG9mIGVsZW1lbnROb2RlLmNoaWxkcmVuKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0LmlzSlNYRWxlbWVudChjaGlsZCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrVGFnTmFtZUVkaXRhYmxlKGNoaWxkLm9wZW5pbmdFbGVtZW50LCBFRElUQUJMRV9IVE1MX1RBR1MpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoYXNOb25FZGl0YWJsZUpzeENoaWxkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGhhc05vbkVkaXRhYmxlSnN4Q2hpbGQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZGlzYWJsZWRBdHRyaWJ1dGUgPSB0LmpzeEF0dHJpYnV0ZShcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0LmpzeElkZW50aWZpZXIoJ2RhdGEtZWRpdC1kaXNhYmxlZCcpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHQuc3RyaW5nTGl0ZXJhbChcInRydWVcIilcclxuXHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b3BlbmluZ05vZGUuYXR0cmlidXRlcy5wdXNoKGRpc2FibGVkQXR0cmlidXRlKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXR0cmlidXRlc0FkZGVkKys7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIENvbmRpdGlvbiA0OiBJcyBhbnkgYW5jZXN0b3IgSlNYRWxlbWVudCBhbHNvIGVkaXRhYmxlP1xyXG5cdFx0XHRcdFx0XHRcdGxldCBjdXJyZW50QW5jZXN0b3JDYW5kaWRhdGVQYXRoID0gcGF0aC5wYXJlbnRQYXRoLnBhcmVudFBhdGg7XHJcblx0XHRcdFx0XHRcdFx0d2hpbGUgKGN1cnJlbnRBbmNlc3RvckNhbmRpZGF0ZVBhdGgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGFuY2VzdG9ySnN4RWxlbWVudFBhdGggPSBjdXJyZW50QW5jZXN0b3JDYW5kaWRhdGVQYXRoLmlzSlNYRWxlbWVudCgpXHJcblx0XHRcdFx0XHRcdFx0XHRcdD8gY3VycmVudEFuY2VzdG9yQ2FuZGlkYXRlUGF0aFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ6IGN1cnJlbnRBbmNlc3RvckNhbmRpZGF0ZVBhdGguZmluZFBhcmVudChwID0+IHAuaXNKU1hFbGVtZW50KCkpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmICghYW5jZXN0b3JKc3hFbGVtZW50UGF0aCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tUYWdOYW1lRWRpdGFibGUoYW5jZXN0b3JKc3hFbGVtZW50UGF0aC5ub2RlLm9wZW5pbmdFbGVtZW50LCBFRElUQUJMRV9IVE1MX1RBR1MpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRBbmNlc3RvckNhbmRpZGF0ZVBhdGggPSBhbmNlc3RvckpzeEVsZW1lbnRQYXRoLnBhcmVudFBhdGg7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRjb25zdCBsaW5lID0gb3BlbmluZ05vZGUubG9jLnN0YXJ0LmxpbmU7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgY29sdW1uID0gb3BlbmluZ05vZGUubG9jLnN0YXJ0LmNvbHVtbiArIDE7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgZWRpdElkID0gYCR7d2ViUmVsYXRpdmVGaWxlUGF0aH06JHtsaW5lfToke2NvbHVtbn1gO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpZEF0dHJpYnV0ZSA9IHQuanN4QXR0cmlidXRlKFxyXG5cdFx0XHRcdFx0XHRcdFx0dC5qc3hJZGVudGlmaWVyKCdkYXRhLWVkaXQtaWQnKSxcclxuXHRcdFx0XHRcdFx0XHRcdHQuc3RyaW5nTGl0ZXJhbChlZGl0SWQpXHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0b3BlbmluZ05vZGUuYXR0cmlidXRlcy5wdXNoKGlkQXR0cmlidXRlKTtcclxuXHRcdFx0XHRcdFx0XHRhdHRyaWJ1dGVzQWRkZWQrKztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlc0FkZGVkID4gMCkge1xyXG5cdFx0XHRcdFx0Y29uc3Qgb3V0cHV0ID0gZ2VuZXJhdGVTb3VyY2VXaXRoTWFwKGJhYmVsQXN0LCB3ZWJSZWxhdGl2ZUZpbGVQYXRoLCBjb2RlKTtcclxuXHRcdFx0XHRcdHJldHVybiB7IGNvZGU6IG91dHB1dC5jb2RlLCBtYXA6IG91dHB1dC5tYXAgfTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFt2aXRlXVt2aXN1YWwtZWRpdG9yXSBFcnJvciB0cmFuc2Zvcm1pbmcgJHtpZH06YCwgZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvLyBVcGRhdGVzIHNvdXJjZSBjb2RlIGJhc2VkIG9uIHRoZSBjaGFuZ2VzIHJlY2VpdmVkIGZyb20gdGhlIGNsaWVudFxyXG5cdFx0Y29uZmlndXJlU2VydmVyKHNlcnZlcikge1xyXG5cdFx0XHRzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvYXBpL2FwcGx5LWVkaXQnLCBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcclxuXHRcdFx0XHRpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSByZXR1cm4gbmV4dCgpO1xyXG5cclxuXHRcdFx0XHRsZXQgYm9keSA9ICcnO1xyXG5cdFx0XHRcdHJlcS5vbignZGF0YScsIGNodW5rID0+IHsgYm9keSArPSBjaHVuay50b1N0cmluZygpOyB9KTtcclxuXHJcblx0XHRcdFx0cmVxLm9uKCdlbmQnLCBhc3luYyAoKSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgYWJzb2x1dGVGaWxlUGF0aCA9ICcnO1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgeyBlZGl0SWQsIG5ld0Z1bGxUZXh0IH0gPSBKU09OLnBhcnNlKGJvZHkpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCFlZGl0SWQgfHwgdHlwZW9mIG5ld0Z1bGxUZXh0ID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0XHRcdHJlcy53cml0ZUhlYWQoNDAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ01pc3NpbmcgZWRpdElkIG9yIG5ld0Z1bGxUZXh0JyB9KSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNvbnN0IHBhcnNlZElkID0gcGFyc2VFZGl0SWQoZWRpdElkKTtcclxuXHRcdFx0XHRcdFx0aWYgKCFwYXJzZWRJZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlcy53cml0ZUhlYWQoNDAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludmFsaWQgZWRpdElkIGZvcm1hdCAoZmlsZVBhdGg6bGluZTpjb2x1bW4pJyB9KSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNvbnN0IHsgZmlsZVBhdGgsIGxpbmUsIGNvbHVtbiB9ID0gcGFyc2VkSWQ7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBWYWxpZGF0ZSBmaWxlIHBhdGhcclxuXHRcdFx0XHRcdFx0Y29uc3QgdmFsaWRhdGlvbiA9IHZhbGlkYXRlRmlsZVBhdGgoZmlsZVBhdGgpO1xyXG5cdFx0XHRcdFx0XHRpZiAoIXZhbGlkYXRpb24uaXNWYWxpZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlcy53cml0ZUhlYWQoNDAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogdmFsaWRhdGlvbi5lcnJvciB9KSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YWJzb2x1dGVGaWxlUGF0aCA9IHZhbGlkYXRpb24uYWJzb2x1dGVQYXRoO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gUGFyc2UgQVNUXHJcblx0XHRcdFx0XHRcdGNvbnN0IG9yaWdpbmFsQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhhYnNvbHV0ZUZpbGVQYXRoLCAndXRmLTgnKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgYmFiZWxBc3QgPSBwYXJzZUZpbGVUb0FTVChhYnNvbHV0ZUZpbGVQYXRoKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIEZpbmQgdGFyZ2V0IG5vZGUgKG5vdGU6IGFwcGx5LWVkaXQgdXNlcyBjb2x1bW4rMSlcclxuXHRcdFx0XHRcdFx0Y29uc3QgdGFyZ2V0Tm9kZVBhdGggPSBmaW5kSlNYRWxlbWVudEF0UG9zaXRpb24oYmFiZWxBc3QsIGxpbmUsIGNvbHVtbiArIDEpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCF0YXJnZXROb2RlUGF0aCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlcy53cml0ZUhlYWQoNDA0LCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ1RhcmdldCBub2RlIG5vdCBmb3VuZCBieSBsaW5lL2NvbHVtbicsIGVkaXRJZCB9KSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNvbnN0IHRhcmdldE9wZW5pbmdFbGVtZW50ID0gdGFyZ2V0Tm9kZVBhdGgubm9kZTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgcGFyZW50RWxlbWVudE5vZGUgPSB0YXJnZXROb2RlUGF0aC5wYXJlbnRQYXRoPy5ub2RlO1xyXG5cclxuXHRcdFx0XHRcdFx0Y29uc3QgaXNJbWFnZUVsZW1lbnQgPSB0YXJnZXRPcGVuaW5nRWxlbWVudC5uYW1lICYmIHRhcmdldE9wZW5pbmdFbGVtZW50Lm5hbWUubmFtZSA9PT0gJ2ltZyc7XHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgYmVmb3JlQ29kZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRsZXQgYWZ0ZXJDb2RlID0gJyc7XHJcblx0XHRcdFx0XHRcdGxldCBtb2RpZmllZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGlzSW1hZ2VFbGVtZW50KSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gSGFuZGxlIGltYWdlIHNyYyBhdHRyaWJ1dGUgdXBkYXRlXHJcblx0XHRcdFx0XHRcdFx0YmVmb3JlQ29kZSA9IGdlbmVyYXRlQ29kZSh0YXJnZXRPcGVuaW5nRWxlbWVudCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNyY0F0dHIgPSB0YXJnZXRPcGVuaW5nRWxlbWVudC5hdHRyaWJ1dGVzLmZpbmQoYXR0ciA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0dC5pc0pTWEF0dHJpYnV0ZShhdHRyKSAmJiBhdHRyLm5hbWUgJiYgYXR0ci5uYW1lLm5hbWUgPT09ICdzcmMnXHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHNyY0F0dHIgJiYgdC5pc1N0cmluZ0xpdGVyYWwoc3JjQXR0ci52YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHNyY0F0dHIudmFsdWUgPSB0LnN0cmluZ0xpdGVyYWwobmV3RnVsbFRleHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0bW9kaWZpZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0YWZ0ZXJDb2RlID0gZ2VuZXJhdGVDb2RlKHRhcmdldE9wZW5pbmdFbGVtZW50KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmVudEVsZW1lbnROb2RlICYmIHQuaXNKU1hFbGVtZW50KHBhcmVudEVsZW1lbnROb2RlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YmVmb3JlQ29kZSA9IGdlbmVyYXRlQ29kZShwYXJlbnRFbGVtZW50Tm9kZSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudE5vZGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChuZXdGdWxsVGV4dCAmJiBuZXdGdWxsVGV4dC50cmltKCkgIT09ICcnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG5ld1RleHROb2RlID0gdC5qc3hUZXh0KG5ld0Z1bGxUZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudE5vZGUuY2hpbGRyZW4ucHVzaChuZXdUZXh0Tm9kZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRtb2RpZmllZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRhZnRlckNvZGUgPSBnZW5lcmF0ZUNvZGUocGFyZW50RWxlbWVudE5vZGUpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCFtb2RpZmllZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlcy53cml0ZUhlYWQoNDA5LCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0NvdWxkIG5vdCBhcHBseSBjaGFuZ2VzIHRvIEFTVC4nIH0pKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Y29uc3Qgd2ViUmVsYXRpdmVGaWxlUGF0aCA9IHBhdGgucmVsYXRpdmUoVklURV9QUk9KRUNUX1JPT1QsIGFic29sdXRlRmlsZVBhdGgpLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJyk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IG91dHB1dCA9IGdlbmVyYXRlU291cmNlV2l0aE1hcChiYWJlbEFzdCwgd2ViUmVsYXRpdmVGaWxlUGF0aCwgb3JpZ2luYWxDb250ZW50KTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgbmV3Q29udGVudCA9IG91dHB1dC5jb2RlO1xyXG5cclxuXHRcdFx0XHRcdFx0cmVzLndyaXRlSGVhZCgyMDAsIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcclxuXHRcdFx0XHRcdFx0cmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHRcdFx0c3VjY2VzczogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRuZXdGaWxlQ29udGVudDogbmV3Q29udGVudCxcclxuXHRcdFx0XHRcdFx0XHRiZWZvcmVDb2RlLFxyXG5cdFx0XHRcdFx0XHRcdGFmdGVyQ29kZSxcclxuXHRcdFx0XHRcdFx0fSkpO1xyXG5cclxuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdFx0XHRcdHJlcy53cml0ZUhlYWQoNTAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcblx0XHRcdFx0XHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvciBkdXJpbmcgZWRpdCBhcHBsaWNhdGlvbi4nIH0pKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXN1YXJpb1xcXFxwcm9zcGVyYS1wYWdlc1xcXFxwbHVnaW5zXFxcXHV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc3VhcmlvXFxcXHByb3NwZXJhLXBhZ2VzXFxcXHBsdWdpbnNcXFxcdXRpbHNcXFxcYXN0LXV0aWxzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Vc3VhcmlvL3Byb3NwZXJhLXBhZ2VzL3BsdWdpbnMvdXRpbHMvYXN0LXV0aWxzLmpzXCI7aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xyXG5pbXBvcnQgZ2VuZXJhdGUgZnJvbSAnQGJhYmVsL2dlbmVyYXRvcic7XHJcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnQGJhYmVsL3BhcnNlcic7XHJcbmltcG9ydCB0cmF2ZXJzZUJhYmVsIGZyb20gJ0BiYWJlbC90cmF2ZXJzZSc7XHJcbmltcG9ydCB7XHJcblx0aXNKU1hJZGVudGlmaWVyLFxyXG5cdGlzSlNYTWVtYmVyRXhwcmVzc2lvbixcclxufSBmcm9tICdAYmFiZWwvdHlwZXMnO1xyXG5cclxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcclxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xyXG5jb25zdCBWSVRFX1BST0pFQ1RfUk9PVCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLicpO1xyXG5cclxuLy8gQmxhY2tsaXN0IG9mIGNvbXBvbmVudHMgdGhhdCBzaG91bGQgbm90IGJlIGV4dHJhY3RlZCAodXRpbGl0eS9ub24tdmlzdWFsIGNvbXBvbmVudHMpXHJcbmNvbnN0IENPTVBPTkVOVF9CTEFDS0xJU1QgPSBuZXcgU2V0KFtcclxuXHQnSGVsbWV0JyxcclxuXHQnSGVsbWV0UHJvdmlkZXInLFxyXG5cdCdIZWFkJyxcclxuXHQnaGVhZCcsXHJcblx0J01ldGEnLFxyXG5cdCdtZXRhJyxcclxuXHQnU2NyaXB0JyxcclxuXHQnc2NyaXB0JyxcclxuXHQnTm9TY3JpcHQnLFxyXG5cdCdub3NjcmlwdCcsXHJcblx0J1N0eWxlJyxcclxuXHQnc3R5bGUnLFxyXG5cdCd0aXRsZScsXHJcblx0J1RpdGxlJyxcclxuXHQnbGluaycsXHJcblx0J0xpbmsnLFxyXG5dKTtcclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZXMgdGhhdCBhIGZpbGUgcGF0aCBpcyBzYWZlIHRvIGFjY2Vzc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBSZWxhdGl2ZSBmaWxlIHBhdGhcclxuICogQHJldHVybnMge3sgaXNWYWxpZDogYm9vbGVhbiwgYWJzb2x1dGVQYXRoPzogc3RyaW5nLCBlcnJvcj86IHN0cmluZyB9fSAtIE9iamVjdCBjb250YWluaW5nIHZhbGlkYXRpb24gcmVzdWx0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVGaWxlUGF0aChmaWxlUGF0aCkge1xyXG5cdGlmICghZmlsZVBhdGgpIHtcclxuXHRcdHJldHVybiB7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcjogJ01pc3NpbmcgZmlsZVBhdGgnIH07XHJcblx0fVxyXG5cclxuXHRjb25zdCBhYnNvbHV0ZUZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKFZJVEVfUFJPSkVDVF9ST09ULCBmaWxlUGF0aCk7XHJcblxyXG5cdGlmIChmaWxlUGF0aC5pbmNsdWRlcygnLi4nKVxyXG5cdFx0fHwgIWFic29sdXRlRmlsZVBhdGguc3RhcnRzV2l0aChWSVRFX1BST0pFQ1RfUk9PVClcclxuXHRcdHx8IGFic29sdXRlRmlsZVBhdGguaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcblx0XHRyZXR1cm4geyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3I6ICdJbnZhbGlkIHBhdGgnIH07XHJcblx0fVxyXG5cclxuXHRpZiAoIWZzLmV4aXN0c1N5bmMoYWJzb2x1dGVGaWxlUGF0aCkpIHtcclxuXHRcdHJldHVybiB7IGlzVmFsaWQ6IGZhbHNlLCBlcnJvcjogJ0ZpbGUgbm90IGZvdW5kJyB9O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHsgaXNWYWxpZDogdHJ1ZSwgYWJzb2x1dGVQYXRoOiBhYnNvbHV0ZUZpbGVQYXRoIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQYXJzZXMgYSBmaWxlIGludG8gYSBCYWJlbCBBU1RcclxuICogQHBhcmFtIHtzdHJpbmd9IGFic29sdXRlRmlsZVBhdGggLSBBYnNvbHV0ZSBwYXRoIHRvIGZpbGVcclxuICogQHJldHVybnMge29iamVjdH0gQmFiZWwgQVNUXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VGaWxlVG9BU1QoYWJzb2x1dGVGaWxlUGF0aCkge1xyXG5cdGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoYWJzb2x1dGVGaWxlUGF0aCwgJ3V0Zi04Jyk7XHJcblxyXG5cdHJldHVybiBwYXJzZShjb250ZW50LCB7XHJcblx0XHRzb3VyY2VUeXBlOiAnbW9kdWxlJyxcclxuXHRcdHBsdWdpbnM6IFsnanN4JywgJ3R5cGVzY3JpcHQnXSxcclxuXHRcdGVycm9yUmVjb3Zlcnk6IHRydWUsXHJcblx0fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kcyBhIEpTWCBvcGVuaW5nIGVsZW1lbnQgYXQgYSBzcGVjaWZpYyBsaW5lIGFuZCBjb2x1bW5cclxuICogQHBhcmFtIHtvYmplY3R9IGFzdCAtIEJhYmVsIEFTVFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbGluZSAtIExpbmUgbnVtYmVyICgxLWluZGV4ZWQpXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW4gLSBDb2x1bW4gbnVtYmVyICgwLWluZGV4ZWQgZm9yIGdldC1jb2RlLWJsb2NrLCAxLWluZGV4ZWQgZm9yIGFwcGx5LWVkaXQpXHJcbiAqIEByZXR1cm5zIHtvYmplY3QgfCBudWxsfSBCYWJlbCBwYXRoIHRvIHRoZSBKU1ggb3BlbmluZyBlbGVtZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZEpTWEVsZW1lbnRBdFBvc2l0aW9uKGFzdCwgbGluZSwgY29sdW1uKSB7XHJcblx0bGV0IHRhcmdldE5vZGVQYXRoID0gbnVsbDtcclxuXHRsZXQgY2xvc2VzdE5vZGVQYXRoID0gbnVsbDtcclxuXHRsZXQgY2xvc2VzdERpc3RhbmNlID0gSW5maW5pdHk7XHJcblx0Y29uc3QgYWxsTm9kZXNPbkxpbmUgPSBbXTtcclxuXHJcblx0Y29uc3QgdmlzaXRvciA9IHtcclxuXHRcdEpTWE9wZW5pbmdFbGVtZW50KHBhdGgpIHtcclxuXHRcdFx0Y29uc3Qgbm9kZSA9IHBhdGgubm9kZTtcclxuXHRcdFx0aWYgKG5vZGUubG9jKSB7XHJcblx0XHRcdFx0Ly8gRXhhY3QgbWF0Y2ggKHdpdGggdG9sZXJhbmNlIGZvciBvZmYtYnktb25lIGNvbHVtbiBkaWZmZXJlbmNlcylcclxuXHRcdFx0XHRpZiAobm9kZS5sb2Muc3RhcnQubGluZSA9PT0gbGluZVxyXG5cdFx0XHRcdFx0JiYgTWF0aC5hYnMobm9kZS5sb2Muc3RhcnQuY29sdW1uIC0gY29sdW1uKSA8PSAxKSB7XHJcblx0XHRcdFx0XHR0YXJnZXROb2RlUGF0aCA9IHBhdGg7XHJcblx0XHRcdFx0XHRwYXRoLnN0b3AoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFRyYWNrIGFsbCBub2RlcyBvbiB0aGUgc2FtZSBsaW5lXHJcblx0XHRcdFx0aWYgKG5vZGUubG9jLnN0YXJ0LmxpbmUgPT09IGxpbmUpIHtcclxuXHRcdFx0XHRcdGFsbE5vZGVzT25MaW5lLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRwYXRoLFxyXG5cdFx0XHRcdFx0XHRjb2x1bW46IG5vZGUubG9jLnN0YXJ0LmNvbHVtbixcclxuXHRcdFx0XHRcdFx0ZGlzdGFuY2U6IE1hdGguYWJzKG5vZGUubG9jLnN0YXJ0LmNvbHVtbiAtIGNvbHVtbiksXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFRyYWNrIGNsb3Nlc3QgbWF0Y2ggb24gdGhlIHNhbWUgbGluZSBmb3IgZmFsbGJhY2tcclxuXHRcdFx0XHRpZiAobm9kZS5sb2Muc3RhcnQubGluZSA9PT0gbGluZSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhub2RlLmxvYy5zdGFydC5jb2x1bW4gLSBjb2x1bW4pO1xyXG5cdFx0XHRcdFx0aWYgKGRpc3RhbmNlIDwgY2xvc2VzdERpc3RhbmNlKSB7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3REaXN0YW5jZSA9IGRpc3RhbmNlO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0Tm9kZVBhdGggPSBwYXRoO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8vIEFsc28gY2hlY2sgSlNYRWxlbWVudCBub2RlcyB0aGF0IGNvbnRhaW4gdGhlIHBvc2l0aW9uXHJcblx0XHRKU1hFbGVtZW50KHBhdGgpIHtcclxuXHRcdFx0Y29uc3Qgbm9kZSA9IHBhdGgubm9kZTtcclxuXHRcdFx0aWYgKCFub2RlLmxvYykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhpcyBlbGVtZW50IHNwYW5zIHRoZSB0YXJnZXQgbGluZSAoZm9yIG11bHRpLWxpbmUgZWxlbWVudHMpXHJcblx0XHRcdGlmIChub2RlLmxvYy5zdGFydC5saW5lID4gbGluZSB8fCBub2RlLmxvYy5lbmQubGluZSA8IGxpbmUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIElmIHdlJ3JlIGluc2lkZSB0aGlzIGVsZW1lbnQncyByYW5nZSwgY29uc2lkZXIgaXRzIG9wZW5pbmcgZWxlbWVudFxyXG5cdFx0XHRpZiAoIXBhdGgubm9kZS5vcGVuaW5nRWxlbWVudD8ubG9jKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBvcGVuaW5nTGluZSA9IHBhdGgubm9kZS5vcGVuaW5nRWxlbWVudC5sb2Muc3RhcnQubGluZTtcclxuXHRcdFx0Y29uc3Qgb3BlbmluZ0NvbCA9IHBhdGgubm9kZS5vcGVuaW5nRWxlbWVudC5sb2Muc3RhcnQuY29sdW1uO1xyXG5cclxuXHRcdFx0Ly8gUHJlZmVyIGVsZW1lbnRzIHRoYXQgc3RhcnQgb24gdGhlIGV4YWN0IGxpbmVcclxuXHRcdFx0aWYgKG9wZW5pbmdMaW5lID09PSBsaW5lKSB7XHJcblx0XHRcdFx0Y29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhvcGVuaW5nQ29sIC0gY29sdW1uKTtcclxuXHRcdFx0XHRpZiAoZGlzdGFuY2UgPCBjbG9zZXN0RGlzdGFuY2UpIHtcclxuXHRcdFx0XHRcdGNsb3Nlc3REaXN0YW5jZSA9IGRpc3RhbmNlO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdE5vZGVQYXRoID0gcGF0aC5nZXQoJ29wZW5pbmdFbGVtZW50Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSGFuZGxlIGVsZW1lbnRzIHRoYXQgc3RhcnQgYmVmb3JlIHRoZSB0YXJnZXQgbGluZVxyXG5cdFx0XHRpZiAob3BlbmluZ0xpbmUgPCBsaW5lKSB7XHJcblx0XHRcdFx0Y29uc3QgZGlzdGFuY2UgPSAobGluZSAtIG9wZW5pbmdMaW5lKSAqIDEwMDsgLy8gUGVuYWxpemUgYnkgbGluZSBkaXN0YW5jZVxyXG5cdFx0XHRcdGlmIChkaXN0YW5jZSA8IGNsb3Nlc3REaXN0YW5jZSkge1xyXG5cdFx0XHRcdFx0Y2xvc2VzdERpc3RhbmNlID0gZGlzdGFuY2U7XHJcblx0XHRcdFx0XHRjbG9zZXN0Tm9kZVBhdGggPSBwYXRoLmdldCgnb3BlbmluZ0VsZW1lbnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0fTtcclxuXHJcblx0dHJhdmVyc2VCYWJlbC5kZWZhdWx0KGFzdCwgdmlzaXRvcik7XHJcblxyXG5cdC8vIFJldHVybiBleGFjdCBtYXRjaCBpZiBmb3VuZCwgb3RoZXJ3aXNlIHJldHVybiBjbG9zZXN0IG1hdGNoIGlmIHdpdGhpbiByZWFzb25hYmxlIGRpc3RhbmNlXHJcblx0Ly8gVXNlIGxhcmdlciB0aHJlc2hvbGQgKDUwIGNoYXJzKSBmb3Igc2FtZS1saW5lIGVsZW1lbnRzLCA1IGxpbmVzIGZvciBtdWx0aS1saW5lIGVsZW1lbnRzXHJcblx0Y29uc3QgdGhyZXNob2xkID0gY2xvc2VzdERpc3RhbmNlIDwgMTAwID8gNTAgOiA1MDA7XHJcblx0cmV0dXJuIHRhcmdldE5vZGVQYXRoIHx8IChjbG9zZXN0RGlzdGFuY2UgPD0gdGhyZXNob2xkID8gY2xvc2VzdE5vZGVQYXRoIDogbnVsbCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgYSBKU1ggZWxlbWVudCBuYW1lIGlzIGJsYWNrbGlzdGVkXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBqc3hPcGVuaW5nRWxlbWVudCAtIEJhYmVsIEpTWCBvcGVuaW5nIGVsZW1lbnQgbm9kZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBibGFja2xpc3RlZFxyXG4gKi9cclxuZnVuY3Rpb24gaXNCbGFja2xpc3RlZENvbXBvbmVudChqc3hPcGVuaW5nRWxlbWVudCkge1xyXG5cdGlmICghanN4T3BlbmluZ0VsZW1lbnQgfHwgIWpzeE9wZW5pbmdFbGVtZW50Lm5hbWUpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdC8vIEhhbmRsZSBKU1hJZGVudGlmaWVyIChlLmcuLCA8SGVsbWV0PilcclxuXHRpZiAoaXNKU1hJZGVudGlmaWVyKGpzeE9wZW5pbmdFbGVtZW50Lm5hbWUpKSB7XHJcblx0XHRyZXR1cm4gQ09NUE9ORU5UX0JMQUNLTElTVC5oYXMoanN4T3BlbmluZ0VsZW1lbnQubmFtZS5uYW1lKTtcclxuXHR9XHJcblxyXG5cdC8vIEhhbmRsZSBKU1hNZW1iZXJFeHByZXNzaW9uIChlLmcuLCA8UmVhY3QuRnJhZ21lbnQ+KVxyXG5cdGlmIChpc0pTWE1lbWJlckV4cHJlc3Npb24oanN4T3BlbmluZ0VsZW1lbnQubmFtZSkpIHtcclxuXHRcdGxldCBjdXJyZW50ID0ganN4T3BlbmluZ0VsZW1lbnQubmFtZTtcclxuXHRcdHdoaWxlIChpc0pTWE1lbWJlckV4cHJlc3Npb24oY3VycmVudCkpIHtcclxuXHRcdFx0Y3VycmVudCA9IGN1cnJlbnQucHJvcGVydHk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNKU1hJZGVudGlmaWVyKGN1cnJlbnQpKSB7XHJcblx0XHRcdHJldHVybiBDT01QT05FTlRfQkxBQ0tMSVNULmhhcyhjdXJyZW50Lm5hbWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGNvZGUgZnJvbSBhbiBBU1Qgbm9kZVxyXG4gKiBAcGFyYW0ge29iamVjdH0gbm9kZSAtIEJhYmVsIEFTVCBub2RlXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gR2VuZXJhdG9yIG9wdGlvbnNcclxuICogQHJldHVybnMge3N0cmluZ30gR2VuZXJhdGVkIGNvZGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNvZGUobm9kZSwgb3B0aW9ucyA9IHt9KSB7XHJcblx0Y29uc3QgZ2VuZXJhdGVGdW5jdGlvbiA9IGdlbmVyYXRlLmRlZmF1bHQgfHwgZ2VuZXJhdGU7XHJcblx0Y29uc3Qgb3V0cHV0ID0gZ2VuZXJhdGVGdW5jdGlvbihub2RlLCBvcHRpb25zKTtcclxuXHRyZXR1cm4gb3V0cHV0LmNvZGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBmdWxsIHNvdXJjZSBmaWxlIGZyb20gQVNUIHdpdGggc291cmNlIG1hcHNcclxuICogQHBhcmFtIHtvYmplY3R9IGFzdCAtIEJhYmVsIEFTVFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlRmlsZU5hbWUgLSBTb3VyY2UgZmlsZSBuYW1lIGZvciBzb3VyY2UgbWFwXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcmlnaW5hbENvZGUgLSBPcmlnaW5hbCBzb3VyY2UgY29kZVxyXG4gKiBAcmV0dXJucyB7e2NvZGU6IHN0cmluZywgbWFwOiBvYmplY3R9fSAtIE9iamVjdCBjb250YWluaW5nIGdlbmVyYXRlZCBjb2RlIGFuZCBzb3VyY2UgbWFwXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTb3VyY2VXaXRoTWFwKGFzdCwgc291cmNlRmlsZU5hbWUsIG9yaWdpbmFsQ29kZSkge1xyXG5cdGNvbnN0IGdlbmVyYXRlRnVuY3Rpb24gPSBnZW5lcmF0ZS5kZWZhdWx0IHx8IGdlbmVyYXRlO1xyXG5cdHJldHVybiBnZW5lcmF0ZUZ1bmN0aW9uKGFzdCwge1xyXG5cdFx0c291cmNlTWFwczogdHJ1ZSxcclxuXHRcdHNvdXJjZUZpbGVOYW1lLFxyXG5cdH0sIG9yaWdpbmFsQ29kZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHRyYWN0cyBjb2RlIGJsb2NrcyBmcm9tIGEgSlNYIGVsZW1lbnQgYXQgYSBzcGVjaWZpYyBsb2NhdGlvblxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBSZWxhdGl2ZSBmaWxlIHBhdGhcclxuICogQHBhcmFtIHtudW1iZXJ9IGxpbmUgLSBMaW5lIG51bWJlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gY29sdW1uIC0gQ29sdW1uIG51bWJlclxyXG4gKiBAcGFyYW0ge29iamVjdH0gW2RvbUNvbnRleHRdIC0gT3B0aW9uYWwgRE9NIGNvbnRleHQgdG8gcmV0dXJuIG9uIGZhaWx1cmVcclxuICogQHJldHVybnMge3tzdWNjZXNzOiBib29sZWFuLCBmaWxlUGF0aD86IHN0cmluZywgc3BlY2lmaWNMaW5lPzogc3RyaW5nLCBlcnJvcj86IHN0cmluZywgZG9tQ29udGV4dD86IG9iamVjdH19IC0gT2JqZWN0IHdpdGggbWV0YWRhdGEgZm9yIExMTVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RDb2RlQmxvY2tzKGZpbGVQYXRoLCBsaW5lLCBjb2x1bW4sIGRvbUNvbnRleHQpIHtcclxuXHR0cnkge1xyXG5cdFx0Ly8gVmFsaWRhdGUgZmlsZSBwYXRoXHJcblx0XHRjb25zdCB2YWxpZGF0aW9uID0gdmFsaWRhdGVGaWxlUGF0aChmaWxlUGF0aCk7XHJcblx0XHRpZiAoIXZhbGlkYXRpb24uaXNWYWxpZCkge1xyXG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IHZhbGlkYXRpb24uZXJyb3IsIGRvbUNvbnRleHQgfTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBQYXJzZSBBU1RcclxuXHRcdGNvbnN0IGFzdCA9IHBhcnNlRmlsZVRvQVNUKHZhbGlkYXRpb24uYWJzb2x1dGVQYXRoKTtcclxuXHJcblx0XHQvLyBGaW5kIHRhcmdldCBub2RlXHJcblx0XHRjb25zdCB0YXJnZXROb2RlUGF0aCA9IGZpbmRKU1hFbGVtZW50QXRQb3NpdGlvbihhc3QsIGxpbmUsIGNvbHVtbik7XHJcblxyXG5cdFx0aWYgKCF0YXJnZXROb2RlUGF0aCkge1xyXG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdUYXJnZXQgbm9kZSBub3QgZm91bmQgYXQgc3BlY2lmaWVkIGxpbmUvY29sdW1uJywgZG9tQ29udGV4dCB9O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIHRoZSB0YXJnZXQgbm9kZSBpcyBhIGJsYWNrbGlzdGVkIGNvbXBvbmVudFxyXG5cdFx0Y29uc3QgaXNCbGFja2xpc3RlZCA9IGlzQmxhY2tsaXN0ZWRDb21wb25lbnQodGFyZ2V0Tm9kZVBhdGgubm9kZSk7XHJcblxyXG5cdFx0aWYgKGlzQmxhY2tsaXN0ZWQpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRzdWNjZXNzOiB0cnVlLFxyXG5cdFx0XHRcdGZpbGVQYXRoLFxyXG5cdFx0XHRcdHNwZWNpZmljTGluZTogJycsXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gR2V0IHNwZWNpZmljIGxpbmUgY29kZVxyXG5cdFx0Y29uc3Qgc3BlY2lmaWNMaW5lID0gZ2VuZXJhdGVDb2RlKHRhcmdldE5vZGVQYXRoLnBhcmVudFBhdGg/Lm5vZGUgfHwgdGFyZ2V0Tm9kZVBhdGgubm9kZSk7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c3VjY2VzczogdHJ1ZSxcclxuXHRcdFx0ZmlsZVBhdGgsXHJcblx0XHRcdHNwZWNpZmljTGluZSxcclxuXHRcdH07XHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoJ1thc3QtdXRpbHNdIEVycm9yIGV4dHJhY3RpbmcgY29kZSBibG9ja3M6JywgZXJyb3IpO1xyXG5cdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRmFpbGVkIHRvIGV4dHJhY3QgY29kZSBibG9ja3MnLCBkb21Db250ZXh0IH07XHJcblx0fVxyXG59XHJcblxyXG4vKipcclxuICogUHJvamVjdCByb290IHBhdGhcclxuICovXHJcbmV4cG9ydCB7IFZJVEVfUFJPSkVDVF9ST09UIH07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXN1YXJpb1xcXFxwcm9zcGVyYS1wYWdlc1xcXFxwbHVnaW5zXFxcXHZpc3VhbC1lZGl0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzdWFyaW9cXFxccHJvc3BlcmEtcGFnZXNcXFxccGx1Z2luc1xcXFx2aXN1YWwtZWRpdG9yXFxcXHZpdGUtcGx1Z2luLWVkaXQtbW9kZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVXN1YXJpby9wcm9zcGVyYS1wYWdlcy9wbHVnaW5zL3Zpc3VhbC1lZGl0b3Ivdml0ZS1wbHVnaW4tZWRpdC1tb2RlLmpzXCI7aW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xyXG5pbXBvcnQgeyBFRElUX01PREVfU1RZTEVTIH0gZnJvbSAnLi92aXN1YWwtZWRpdG9yLWNvbmZpZyc7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSByZXNvbHZlKF9fZmlsZW5hbWUsICcuLicpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5saW5lRWRpdERldlBsdWdpbigpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0bmFtZTogJ3ZpdGU6aW5saW5lLWVkaXQtZGV2JyxcclxuXHRcdGFwcGx5OiAnc2VydmUnLFxyXG5cdFx0dHJhbnNmb3JtSW5kZXhIdG1sKCkge1xyXG5cdFx0XHRjb25zdCBzY3JpcHRQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdlZGl0LW1vZGUtc2NyaXB0LmpzJyk7XHJcblx0XHRcdGNvbnN0IHNjcmlwdENvbnRlbnQgPSByZWFkRmlsZVN5bmMoc2NyaXB0UGF0aCwgJ3V0Zi04Jyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRhZzogJ3NjcmlwdCcsXHJcblx0XHRcdFx0XHRhdHRyczogeyB0eXBlOiAnbW9kdWxlJyB9LFxyXG5cdFx0XHRcdFx0Y2hpbGRyZW46IHNjcmlwdENvbnRlbnQsXHJcblx0XHRcdFx0XHRpbmplY3RUbzogJ2JvZHknXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0YWc6ICdzdHlsZScsXHJcblx0XHRcdFx0XHRjaGlsZHJlbjogRURJVF9NT0RFX1NUWUxFUyxcclxuXHRcdFx0XHRcdGluamVjdFRvOiAnaGVhZCdcclxuXHRcdFx0XHR9XHJcblx0XHRcdF07XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzdWFyaW9cXFxccHJvc3BlcmEtcGFnZXNcXFxccGx1Z2luc1xcXFx2aXN1YWwtZWRpdG9yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc3VhcmlvXFxcXHByb3NwZXJhLXBhZ2VzXFxcXHBsdWdpbnNcXFxcdmlzdWFsLWVkaXRvclxcXFx2aXN1YWwtZWRpdG9yLWNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVXN1YXJpby9wcm9zcGVyYS1wYWdlcy9wbHVnaW5zL3Zpc3VhbC1lZGl0b3IvdmlzdWFsLWVkaXRvci1jb25maWcuanNcIjtleHBvcnQgY29uc3QgUE9QVVBfU1RZTEVTID0gYFxyXG4jaW5saW5lLWVkaXRvci1wb3B1cCB7XHJcblx0d2lkdGg6IDM2MHB4O1xyXG5cdHBvc2l0aW9uOiBmaXhlZDtcclxuXHR6LWluZGV4OiAxMDAwMDtcclxuXHRiYWNrZ3JvdW5kOiAjMTYxNzE4O1xyXG5cdGNvbG9yOiB3aGl0ZTtcclxuXHRib3JkZXI6IDFweCBzb2xpZCAjNGE1NTY4O1xyXG5cdGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcblx0cGFkZGluZzogOHB4O1xyXG5cdGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjIpO1xyXG5cdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcblx0Z2FwOiAxMHB4O1xyXG5cdGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xyXG5cdCNpbmxpbmUtZWRpdG9yLXBvcHVwIHtcclxuXHRcdHdpZHRoOiBjYWxjKDEwMCUgLSAyMHB4KTtcclxuXHR9XHJcbn1cclxuXHJcbiNpbmxpbmUtZWRpdG9yLXBvcHVwLmlzLWFjdGl2ZSB7XHJcblx0ZGlzcGxheTogZmxleDtcclxuXHR0b3A6IDUwJTtcclxuXHRsZWZ0OiA1MCU7XHJcblx0dHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbn1cclxuXHJcbiNpbmxpbmUtZWRpdG9yLXBvcHVwLmlzLWRpc2FibGVkLXZpZXcge1xyXG5cdHBhZGRpbmc6IDEwcHggMTVweDtcclxufVxyXG5cclxuI2lubGluZS1lZGl0b3ItcG9wdXAgdGV4dGFyZWEge1xyXG5cdGhlaWdodDogMTAwcHg7XHJcblx0cGFkZGluZzogNHB4IDhweDtcclxuXHRiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuXHRjb2xvcjogd2hpdGU7XHJcblx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7XHJcblx0Zm9udC1zaXplOiAwLjg3NXJlbTtcclxuXHRsaW5lLWhlaWdodDogMS40MjtcclxuXHRyZXNpemU6IG5vbmU7XHJcblx0b3V0bGluZTogbm9uZTtcclxufVxyXG5cclxuI2lubGluZS1lZGl0b3ItcG9wdXAgLmJ1dHRvbi1jb250YWluZXIge1xyXG5cdGRpc3BsYXk6IGZsZXg7XHJcblx0anVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcclxuXHRnYXA6IDEwcHg7XHJcbn1cclxuXHJcbiNpbmxpbmUtZWRpdG9yLXBvcHVwIC5wb3B1cC1idXR0b24ge1xyXG5cdGJvcmRlcjogbm9uZTtcclxuXHRwYWRkaW5nOiA2cHggMTZweDtcclxuXHRib3JkZXItcmFkaXVzOiA4cHg7XHJcblx0Y3Vyc29yOiBwb2ludGVyO1xyXG5cdGZvbnQtc2l6ZTogMC43NXJlbTtcclxuXHRmb250LXdlaWdodDogNzAwO1xyXG5cdGhlaWdodDogMzRweDtcclxuXHRvdXRsaW5lOiBub25lO1xyXG59XHJcblxyXG4jaW5saW5lLWVkaXRvci1wb3B1cCAuc2F2ZS1idXR0b24ge1xyXG5cdGJhY2tncm91bmQ6ICM2NzNkZTY7XHJcblx0Y29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4jaW5saW5lLWVkaXRvci1wb3B1cCAuY2FuY2VsLWJ1dHRvbiB7XHJcblx0YmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XHJcblx0Ym9yZGVyOiAxcHggc29saWQgIzNiM2Q0YTtcclxuXHRjb2xvcjogd2hpdGU7XHJcblxyXG5cdCY6aG92ZXIge1xyXG5cdGJhY2tncm91bmQ6IzQ3NDk1ODtcclxuXHR9XHJcbn1cclxuYDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3B1cEhUTUxUZW1wbGF0ZShzYXZlTGFiZWwsIGNhbmNlbExhYmVsKSB7XHJcblx0cmV0dXJuIGBcclxuXHQ8dGV4dGFyZWE+PC90ZXh0YXJlYT5cclxuXHQ8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxyXG5cdFx0PGJ1dHRvbiBjbGFzcz1cInBvcHVwLWJ1dHRvbiBjYW5jZWwtYnV0dG9uXCI+JHtjYW5jZWxMYWJlbH08L2J1dHRvbj5cclxuXHRcdDxidXR0b24gY2xhc3M9XCJwb3B1cC1idXR0b24gc2F2ZS1idXR0b25cIj4ke3NhdmVMYWJlbH08L2J1dHRvbj5cclxuXHQ8L2Rpdj5cclxuXHRgO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgRURJVF9NT0RFX1NUWUxFUyA9IGBcclxuXHQjcm9vdFtkYXRhLWVkaXQtbW9kZS1lbmFibGVkPVwidHJ1ZVwiXSBbZGF0YS1lZGl0LWlkXSB7XHJcblx0XHRjdXJzb3I6IHBvaW50ZXI7IFxyXG5cdFx0b3V0bGluZTogMnB4IGRhc2hlZCAjMzU3REY5OyBcclxuXHRcdG91dGxpbmUtb2Zmc2V0OiAycHg7XHJcblx0XHRtaW4taGVpZ2h0OiAxZW07XHJcblx0fVxyXG5cdCNyb290W2RhdGEtZWRpdC1tb2RlLWVuYWJsZWQ9XCJ0cnVlXCJdIGltZ1tkYXRhLWVkaXQtaWRdIHtcclxuXHRcdG91dGxpbmUtb2Zmc2V0OiAtMnB4O1xyXG5cdH1cclxuXHQjcm9vdFtkYXRhLWVkaXQtbW9kZS1lbmFibGVkPVwidHJ1ZVwiXSB7XHJcblx0XHRjdXJzb3I6IHBvaW50ZXI7XHJcblx0fVxyXG5cdCNyb290W2RhdGEtZWRpdC1tb2RlLWVuYWJsZWQ9XCJ0cnVlXCJdIFtkYXRhLWVkaXQtaWRdOmhvdmVyIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6ICMzNTdERjkzMztcclxuXHRcdG91dGxpbmUtY29sb3I6ICMzNTdERjk7IFxyXG5cdH1cclxuXHJcblx0QGtleWZyYW1lcyBmYWRlSW5Ub29sdGlwIHtcclxuXHRcdGZyb20ge1xyXG5cdFx0XHRvcGFjaXR5OiAwO1xyXG5cdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNXB4KTtcclxuXHRcdH1cclxuXHRcdHRvIHtcclxuXHRcdFx0b3BhY2l0eTogMTtcclxuXHRcdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0I2lubGluZS1lZGl0b3ItZGlzYWJsZWQtdG9vbHRpcCB7XHJcblx0XHRkaXNwbGF5OiBub25lOyBcclxuXHRcdG9wYWNpdHk6IDA7IFxyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogIzFEMUUyMDtcclxuXHRcdGNvbG9yOiB3aGl0ZTtcclxuXHRcdHBhZGRpbmc6IDRweCA4cHg7XHJcblx0XHRib3JkZXItcmFkaXVzOiA4cHg7XHJcblx0XHR6LWluZGV4OiAxMDAwMTtcclxuXHRcdGZvbnQtc2l6ZTogMTRweDtcclxuXHRcdGJvcmRlcjogMXB4IHNvbGlkICMzQjNENEE7XHJcblx0XHRtYXgtd2lkdGg6IDE4NHB4O1xyXG5cdFx0dGV4dC1hbGlnbjogY2VudGVyO1xyXG5cdH1cclxuXHJcblx0I2lubGluZS1lZGl0b3ItZGlzYWJsZWQtdG9vbHRpcC50b29sdGlwLWFjdGl2ZSB7XHJcblx0XHRkaXNwbGF5OiBibG9jaztcclxuXHRcdGFuaW1hdGlvbjogZmFkZUluVG9vbHRpcCAwLjJzIGVhc2Utb3V0IGZvcndhcmRzO1xyXG5cdH1cclxuYDtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc3VhcmlvXFxcXHByb3NwZXJhLXBhZ2VzXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzdWFyaW9cXFxccHJvc3BlcmEtcGFnZXNcXFxccGx1Z2luc1xcXFx2aXRlLXBsdWdpbi1pZnJhbWUtcm91dGUtcmVzdG9yYXRpb24uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzdWFyaW8vcHJvc3BlcmEtcGFnZXMvcGx1Z2lucy92aXRlLXBsdWdpbi1pZnJhbWUtcm91dGUtcmVzdG9yYXRpb24uanNcIjtleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpZnJhbWVSb3V0ZVJlc3RvcmF0aW9uUGx1Z2luKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAndml0ZTppZnJhbWUtcm91dGUtcmVzdG9yYXRpb24nLFxyXG4gICAgYXBwbHk6ICdzZXJ2ZScsXHJcbiAgICB0cmFuc2Zvcm1JbmRleEh0bWwoKSB7XHJcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGBcclxuICAgICAgY29uc3QgQUxMT1dFRF9QQVJFTlRfT1JJR0lOUyA9IFtcclxuICAgICAgICAgIFwiaHR0cHM6Ly9ob3Jpem9ucy5ob3N0aW5nZXIuY29tXCIsXHJcbiAgICAgICAgICBcImh0dHBzOi8vaG9yaXpvbnMuaG9zdGluZ2VyLmRldlwiLFxyXG4gICAgICAgICAgXCJodHRwczovL2hvcml6b25zLWZyb250ZW5kLWxvY2FsLmhvc3Rpbmdlci5kZXZcIixcclxuICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBwYWdlIGlzIGluIGFuIGlmcmFtZVxyXG4gICAgICAgIGlmICh3aW5kb3cuc2VsZiAhPT0gd2luZG93LnRvcCkge1xyXG4gICAgICAgICAgY29uc3QgU1RPUkFHRV9LRVkgPSAnaG9yaXpvbnMtaWZyYW1lLXNhdmVkLXJvdXRlJztcclxuXHJcbiAgICAgICAgICBjb25zdCBnZXRDdXJyZW50Um91dGUgPSAoKSA9PiBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XHJcblxyXG4gICAgICAgICAgY29uc3Qgc2F2ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Um91dGUgPSBnZXRDdXJyZW50Um91dGUoKTtcclxuICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCBjdXJyZW50Um91dGUpO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe21lc3NhZ2U6ICdyb3V0ZS1jaGFuZ2VkJywgcm91dGU6IGN1cnJlbnRSb3V0ZX0sICcqJyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge31cclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgY29uc3QgcmVwbGFjZUhpc3RvcnlTdGF0ZSA9ICh1cmwpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCAnJywgdXJsKTtcclxuICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgUG9wU3RhdGVFdmVudCgncG9wc3RhdGUnLCB7IHN0YXRlOiBoaXN0b3J5LnN0YXRlIH0pKTtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7fVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGNvbnN0IHJlc3RvcmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZKTtcclxuICAgICAgICAgICAgICBpZiAoIXNhdmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgIGlmICghc2F2ZWQuc3RhcnRzV2l0aCgnLycpKSB7XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFNUT1JBR0VfS0VZKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSBnZXRDdXJyZW50Um91dGUoKTtcclxuICAgICAgICAgICAgICBpZiAoY3VycmVudCAhPT0gc2F2ZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVwbGFjZUhpc3RvcnlTdGF0ZShzYXZlZCkpIHtcclxuICAgICAgICAgICAgICAgICAgcmVwbGFjZUhpc3RvcnlTdGF0ZSgnLycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gKGRvY3VtZW50LmJvZHk/LmlubmVyVGV4dCB8fCAnJykudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVzdG9yZWQgcm91dGUgcmVzdWx0cyBpbiB0b28gbGl0dGxlIGNvbnRlbnQsIGFzc3VtZSBpdCBpcyBpbnZhbGlkIGFuZCBuYXZpZ2F0ZSBob21lXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoIDwgNTApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VIaXN0b3J5U3RhdGUoJy8nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0gY2F0Y2gge31cclxuICAgICAgICAgICAgICAgIH0sIDEwMDApKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge31cclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWxQdXNoU3RhdGUgPSBoaXN0b3J5LnB1c2hTdGF0ZTtcclxuICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgICAgICBvcmlnaW5hbFB1c2hTdGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBjb25zdCBvcmlnaW5hbFJlcGxhY2VTdGF0ZSA9IGhpc3RvcnkucmVwbGFjZVN0YXRlO1xyXG4gICAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUgPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsUmVwbGFjZVN0YXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGNvbnN0IGdldFBhcmVudE9yaWdpbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hbmNlc3Rvck9yaWdpbnMgJiZcclxuICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFuY2VzdG9yT3JpZ2lucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uYW5jZXN0b3JPcmlnaW5zWzBdO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlZmVycmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVSTChkb2N1bWVudC5yZWZlcnJlcikub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJJbnZhbGlkIHJlZmVycmVyIFVSTDpcIiwgZG9jdW1lbnQucmVmZXJyZXIpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgc2F2ZSk7XHJcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHNhdmUpO1xyXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudE9yaWdpbiA9IGdldFBhcmVudE9yaWdpbigpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoZXZlbnQuZGF0YT8udHlwZSA9PT0gXCJyZWRpcmVjdC1ob21lXCIgJiYgcGFyZW50T3JpZ2luICYmIEFMTE9XRURfUEFSRU5UX09SSUdJTlMuaW5jbHVkZXMocGFyZW50T3JpZ2luKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzYXZlZCAmJiBzYXZlZCAhPT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlcGxhY2VIaXN0b3J5U3RhdGUoJy8nKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHJlc3RvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIGA7XHJcblxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXHJcbiAgICAgICAgICBhdHRyczogeyB0eXBlOiAnbW9kdWxlJyB9LFxyXG4gICAgICAgICAgY2hpbGRyZW46IHNjcmlwdCxcclxuICAgICAgICAgIGluamVjdFRvOiAnaGVhZCdcclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVzdWFyaW9cXFxccHJvc3BlcmEtcGFnZXNcXFxccGx1Z2luc1xcXFxzZWxlY3Rpb24tbW9kZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXN1YXJpb1xcXFxwcm9zcGVyYS1wYWdlc1xcXFxwbHVnaW5zXFxcXHNlbGVjdGlvbi1tb2RlXFxcXHZpdGUtcGx1Z2luLXNlbGVjdGlvbi1tb2RlLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Vc3VhcmlvL3Byb3NwZXJhLXBhZ2VzL3BsdWdpbnMvc2VsZWN0aW9uLW1vZGUvdml0ZS1wbHVnaW4tc2VsZWN0aW9uLW1vZGUuanNcIjtpbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdub2RlOmZzJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSByZXNvbHZlKF9fZmlsZW5hbWUsICcuLicpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2VsZWN0aW9uTW9kZVBsdWdpbigpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0bmFtZTogJ3ZpdGU6c2VsZWN0aW9uLW1vZGUnLFxyXG5cdFx0YXBwbHk6ICdzZXJ2ZScsXHJcblxyXG5cdFx0dHJhbnNmb3JtSW5kZXhIdG1sKCkge1xyXG5cdFx0XHRjb25zdCBzY3JpcHRQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdzZWxlY3Rpb24tbW9kZS1zY3JpcHQuanMnKTtcclxuXHRcdFx0Y29uc3Qgc2NyaXB0Q29udGVudCA9IHJlYWRGaWxlU3luYyhzY3JpcHRQYXRoLCAndXRmLTgnKTtcclxuXHJcblx0XHRcdHJldHVybiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGFnOiAnc2NyaXB0JyxcclxuXHRcdFx0XHRcdGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnIH0sXHJcblx0XHRcdFx0XHRjaGlsZHJlbjogc2NyaXB0Q29udGVudCxcclxuXHRcdFx0XHRcdGluamVjdFRvOiAnYm9keScsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XTtcclxuXHRcdH0sXHJcblx0fTtcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVSLE9BQU9BLFdBQVU7QUFDeFMsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsY0FBYyxvQkFBb0I7OztBQ0YwVixPQUFPQyxXQUFVO0FBQ3RaLFNBQVMsU0FBQUMsY0FBYTtBQUN0QixPQUFPQyxvQkFBbUI7QUFDMUIsWUFBWSxPQUFPO0FBQ25CLE9BQU9DLFNBQVE7OztBQ0prVCxPQUFPLFFBQVE7QUFDaFYsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sY0FBYztBQUNyQixTQUFTLGFBQWE7QUFDdEIsT0FBTyxtQkFBbUI7QUFDMUI7QUFBQSxFQUNDO0FBQUEsRUFDQTtBQUFBLE9BQ007QUFUb00sSUFBTSwyQ0FBMkM7QUFXNVAsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTUMsYUFBWSxLQUFLLFFBQVEsVUFBVTtBQUN6QyxJQUFNLG9CQUFvQixLQUFLLFFBQVFBLFlBQVcsT0FBTztBQTJCbEQsU0FBUyxpQkFBaUIsVUFBVTtBQUMxQyxNQUFJLENBQUMsVUFBVTtBQUNkLFdBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxtQkFBbUI7QUFBQSxFQUNwRDtBQUVBLFFBQU0sbUJBQW1CLEtBQUssUUFBUSxtQkFBbUIsUUFBUTtBQUVqRSxNQUFJLFNBQVMsU0FBUyxJQUFJLEtBQ3RCLENBQUMsaUJBQWlCLFdBQVcsaUJBQWlCLEtBQzlDLGlCQUFpQixTQUFTLGNBQWMsR0FBRztBQUM5QyxXQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sZUFBZTtBQUFB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aEgsTUFBTTtBQUFBLElBQ047QUFBQSxFQUNEO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUixnQ0FBZ0M7QUFBQSxJQUNqQztBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2QsT0FBTztBQUFBLE1BQ04saUJBQWlCO0FBQUEsUUFDaEIsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsWUFBWSxDQUFDLFFBQVEsT0FBTyxRQUFRLE9BQU8sT0FBUTtBQUFBLElBQ25ELE9BQU87QUFBQSxNQUNOLEtBQUtDLE1BQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDckM7QUFBQSxFQUNEO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDZCxVQUFVO0FBQUEsUUFDVDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAicGF0aCIsICJwYXJzZSIsICJ0cmF2ZXJzZUJhYmVsIiwgImZzIiwgIl9fZGlybmFtZSIsICJwYXRoIiwgInBhdGgiLCAicGFyc2UiLCAidHJhdmVyc2VCYWJlbCIsICJmcyIsICJmaWxlVVJMVG9QYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAiX19maWxlbmFtZSIsICJmaWxlVVJMVG9QYXRoIiwgIl9fZGlybmFtZSIsICJyZWFkRmlsZVN5bmMiLCAicmVzb2x2ZSIsICJmaWxlVVJMVG9QYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAiX19maWxlbmFtZSIsICJmaWxlVVJMVG9QYXRoIiwgIl9fZGlybmFtZSIsICJyZXNvbHZlIiwgInJlYWRGaWxlU3luYyIsICJwYXRoIl0KfQo=
