'use strict';

/* global require, process, console, module, Promise */

/**
 * Load-and-save report: imports CMMN models with cmmn-moddle and the Flowable
 * descriptor, exports them again and reports what changed.
 *
 * Usage (from the package root):
 *
 *   npm run roundtrip -- [options] [dir ...]
 *
 * Directories default to test/fixtures/xml and .flowable-models (see
 * scripts/fetch-flowable-models.sh); *.part.cmmn fragments are skipped. Options:
 *
 *   --json <file>       write the full report as JSON (default roundtrip-report.json)
 *   --markdown <file>   write the summary as Markdown (default roundtrip-report.md);
 *                       it is also appended to $GITHUB_STEP_SUMMARY when set
 *   --baseline <file>   known losses (default test/roundtrip/known-losses.json);
 *                       exits with 1 when a loss is not in it
 *   --update-baseline   add the current losses to the baseline and remove fixed ones
 *
 * The original and exported XML are compared as namespace-resolved trees, so
 * namespace prefixes, element order, whitespace and number formatting
 * (76.0 / 76) are not reported. Elements are matched by name and id, then by
 * position among siblings of the same name.
 */

var fs = require('fs'),
    path = require('path');

var DOMParser = require('@xmldom/xmldom').DOMParser;

var createModdle = require('../test/helper').createModdle;

var NAMESPACES = {
  'http://www.omg.org/spec/CMMN/20151109/MODEL': 'cmmn',
  'http://www.omg.org/spec/CMMN/20151109/CMMNDI': 'cmmndi',
  'http://www.omg.org/spec/CMMN/20151109/DC': 'dc',
  'http://www.omg.org/spec/CMMN/20151109/DI': 'di',
  'http://flowable.org/cmmn': 'flowable',
  'http://flowable.org/design': 'design',
  'http://www.w3.org/2001/XMLSchema-instance': 'xsi'
};

var XMLNS = 'http://www.w3.org/2000/xmlns/';

var XSI = 'http://www.w3.org/2001/XMLSchema-instance';

var KINDS = {
  'import-error': 'File fails to import',
  'dropped-element': 'Element dropped',
  'dropped-attribute': 'Attribute dropped',
  'changed-attribute': 'Attribute value changed',
  'changed-text': 'Text changed',
  'added-element': 'Element added',
  'added-attribute': 'Attribute added'
};


// arguments

function parseArgs(argv) {
  var args = {
    dirs: [],
    json: 'roundtrip-report.json',
    markdown: 'roundtrip-report.md',
    baseline: 'test/roundtrip/known-losses.json',
    updateBaseline: false
  };

  for (var i = 0; i < argv.length; i++) {
    var arg = argv[i];

    if (arg === '--json') {
      args.json = argv[++i];
    } else if (arg === '--markdown') {
      args.markdown = argv[++i];
    } else if (arg === '--baseline') {
      args.baseline = argv[++i];
    } else if (arg === '--update-baseline') {
      args.updateBaseline = true;
    } else {
      args.dirs.push(arg);
    }
  }

  if (!args.dirs.length) {
    args.dirs = [ 'test/fixtures/xml', '.flowable-models' ].filter(function(dir) {
      return fs.existsSync(dir);
    });
  }

  return args;
}

function findModels(dir) {
  var found = [];

  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(entry) {
    var file = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== '.git' && entry.name !== 'node_modules') {
        found = found.concat(findModels(file));
      }
    } else if (/\.cmmn(11)?(\.xml)?$/.test(entry.name) && !/\.part\.cmmn$/.test(entry.name)) {

      // *.part.cmmn fixtures are fragments (a case, a listener, ...) that the
      // tests parse as a specific type, not as a whole document
      found.push(file);
    }
  });

  return found.sort();
}


// moddle import / export

function roundtrip(xml) {
  var moddle = createModdle();

  return new Promise(function(resolve) {
    moddle.fromXML(xml, 'cmmn:Definitions', function(err, definitions, context) {
      var warnings = ((context && context.warnings) || []).map(function(w) {
        return w.message;
      });

      if (err) {
        return resolve({ error: err.message, warnings: warnings });
      }

      var consoleWarn = console.warn,
          consoleError = console.error,
          logged = [];

      console.warn = console.error = function() {
        logged.push(Array.prototype.join.call(arguments, ' '));
      };

      moddle.toXML(definitions, function(err, savedXML) {
        console.warn = consoleWarn;
        console.error = consoleError;

        warnings = warnings.concat(logged.map(function(message) {
          return 'export: ' + message;
        }));

        if (err) {
          return resolve({ error: 'export failed: ' + err.message, warnings: warnings });
        }

        resolve({ savedXML: savedXML, warnings: warnings });
      });
    });
  });
}


// canonical trees

function displayName(namespaceURI, localName, prefix) {
  if (!namespaceURI) {
    return localName;
  }

  return (NAMESPACES[namespaceURI] || prefix || ('{' + namespaceURI + '}')) + ':' + localName;
}

function normalizeSpace(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function resolveQName(element, value) {
  var parts = value.split(':');

  if (parts.length !== 2) {
    return value;
  }

  var uri = element.lookupNamespaceURI(parts[0]);

  return uri ? displayName(uri, parts[1], parts[0]) : value;
}

function toTree(element) {
  var node = {
    name: displayName(element.namespaceURI, element.localName, element.prefix),
    attrs: {},
    children: [],
    text: ''
  };

  for (var i = 0; i < element.attributes.length; i++) {
    var attr = element.attributes[i];

    if (attr.namespaceURI === XMLNS || attr.name === 'xmlns' || attr.prefix === 'xmlns') {
      continue;
    }

    var name = displayName(attr.namespaceURI, attr.localName, attr.prefix),
        value = attr.value;

    if (attr.namespaceURI === XSI && attr.localName === 'type') {
      value = resolveQName(element, value);
    }

    node.attrs[name] = value;
  }

  var text = '';

  for (var c = element.firstChild; c; c = c.nextSibling) {
    if (c.nodeType === 1) {
      node.children.push(toTree(c));
    } else if (c.nodeType === 3 || c.nodeType === 4) {
      text += c.data;
    }
  }

  node.text = normalizeSpace(text);

  return node;
}

function parseTree(xml) {
  var errors = [];

  var doc = new DOMParser({
    onError: function(level, message) {
      if (level !== 'warning') {
        errors.push(message);
      }
    }
  }).parseFromString(xml, 'text/xml');

  if (!doc || !doc.documentElement) {
    throw new Error('not well-formed XML: ' + errors.join('; '));
  }

  return toTree(doc.documentElement);
}


// descriptor defaults

var defaultsModdle = createModdle();

function upperFirst(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Whether value is the default of attribute attrName on elementName, as the
 * descriptors define it. moddle does not write properties that hold their
 * default value, so such attributes disappear without changing the model.
 */
function isDefaultValue(elementName, attrName, value) {
  var parts = elementName.split(':');

  if (parts.length !== 2) {
    return false;
  }

  var candidates = [ elementName, parts[0] + ':' + upperFirst(parts[1]) ];

  for (var i = 0; i < candidates.length; i++) {
    try {
      var element = defaultsModdle.create(candidates[i]),
          descriptor = defaultsModdle.getPropertyDescriptor(element, attrName);

      if (descriptor && descriptor.default !== undefined) {
        return sameValue(String(descriptor.default), value);
      }
    } catch (e) {
      // not a type of the descriptors
    }
  }

  return false;
}


// comparison

function sameValue(a, b) {
  a = normalizeSpace(a);
  b = normalizeSpace(b);

  if (a === b) {
    return true;
  }

  if (/^(true|false)$/i.test(a) && a.toLowerCase() === b.toLowerCase()) {
    return true;
  }

  var x = Number(a), y = Number(b);

  return a !== '' && b !== '' && isFinite(x) && isFinite(y) && x === y;
}

function describe(node) {
  return '<' + node.name + (node.attrs.id ? ' id="' + node.attrs.id + '"' : '') + '>';
}

function truncate(value, length) {
  value = normalizeSpace(value);

  return value.length > length ? value.slice(0, length - 1) + '…' : value;
}

function matchChildren(original, saved) {
  var pairs = [],
      unmatchedSaved = saved.slice();

  var unmatchedOriginal = original.filter(function(o) {
    var id = o.attrs.id;

    if (!id) {
      return true;
    }

    var index = unmatchedSaved.findIndex(function(s) {
      return s.name === o.name && s.attrs.id === id;
    });

    if (index === -1) {
      return true;
    }

    pairs.push([ o, unmatchedSaved[index] ]);
    unmatchedSaved.splice(index, 1);

    return false;
  });

  unmatchedOriginal = unmatchedOriginal.filter(function(o) {
    var index = unmatchedSaved.findIndex(function(s) {
      return s.name === o.name && (!o.attrs.id || !s.attrs.id);
    });

    if (index === -1) {
      return true;
    }

    pairs.push([ o, unmatchedSaved[index] ]);
    unmatchedSaved.splice(index, 1);

    return false;
  });

  return {
    pairs: pairs,
    dropped: unmatchedOriginal,
    added: unmatchedSaved
  };
}

function compare(original, saved, report) {

  Object.keys(original.attrs).forEach(function(name) {
    if (!(name in saved.attrs)) {
      if (isDefaultValue(original.name, name, original.attrs[name])) {
        return;
      }

      report('dropped-attribute', original.name + '@' + name,
        describe(original) + ' ' + name + '="' + truncate(original.attrs[name], 60) + '"');
    } else if (!sameValue(original.attrs[name], saved.attrs[name])) {
      report('changed-attribute', original.name + '@' + name,
        describe(original) + ' ' + name + ': "' + truncate(original.attrs[name], 40) +
        '" → "' + truncate(saved.attrs[name], 40) + '"');
    }
  });

  Object.keys(saved.attrs).forEach(function(name) {
    if (!(name in original.attrs)) {
      report('added-attribute', original.name + '@' + name,
        describe(original) + ' ' + name + '="' + truncate(saved.attrs[name], 60) + '"');
    }
  });

  if (!sameValue(original.text, saved.text)) {
    report('changed-text', original.name,
      describe(original) + ': "' + truncate(original.text, 40) + '" → "' + truncate(saved.text, 40) + '"');
  }

  var match = matchChildren(original.children, saved.children);

  match.dropped.forEach(function(child) {
    report('dropped-element', original.name + ' > ' + child.name, describe(original) + ' > ' + describe(child));
  });

  match.added.forEach(function(child) {
    report('added-element', original.name + ' > ' + child.name, describe(original) + ' > ' + describe(child));
  });

  match.pairs.forEach(function(pair) {
    compare(pair[0], pair[1], report);
  });
}


// report

function normalizeWarning(message) {
  return message
    .split('\n')[0]
    .replace(/<([^>\s/]+)[^>]*>/g, '<$1>')
    .replace(/(unresolved reference|duplicate ID|illegal ID) <[^>]*>/, '$1');
}

function checkFile(file) {
  var xml = fs.readFileSync(file, 'utf8');

  return roundtrip(xml).then(function(result) {
    var differences = [];

    var report = function(kind, subject, detail) {
      differences.push({ kind: kind, subject: subject, detail: detail });
    };

    if (result.error) {
      var cause = result.warnings[0] || result.error;

      report('import-error', normalizeWarning(cause), truncate(cause, 160));
    } else {
      try {
        compare(parseTree(xml), parseTree(result.savedXML), report);
      } catch (e) {
        report('import-error', 'original is not well-formed XML', truncate(e.message, 160));
      }
    }

    return {
      file: file,
      warnings: result.warnings.map(normalizeWarning),
      differences: differences
    };
  });
}

function groupDifferences(results) {
  var groups = {};

  results.forEach(function(result) {
    result.differences.forEach(function(d) {
      var key = d.kind + ' ' + d.subject;

      var group = groups[key] = groups[key] || {
        key: key,
        kind: d.kind,
        subject: d.subject,
        count: 0,
        files: [],
        example: d.detail
      };

      group.count++;

      if (group.files.indexOf(result.file) === -1) {
        group.files.push(result.file);
      }
    });
  });

  var order = Object.keys(KINDS);

  return Object.keys(groups).map(function(key) {
    return groups[key];
  }).sort(function(a, b) {
    return (order.indexOf(a.kind) - order.indexOf(b.kind)) ||
      (b.files.length - a.files.length) ||
      a.subject.localeCompare(b.subject);
  });
}

function groupWarnings(results) {
  var counts = {};

  results.forEach(function(result) {
    result.warnings.forEach(function(w) {
      counts[w] = counts[w] || { warning: w, files: 0 };
      counts[w].files++;
    });
  });

  return Object.keys(counts).map(function(w) {
    return counts[w];
  }).sort(function(a, b) {
    return b.files - a.files;
  });
}

function readBaseline(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return { losses: {} };
  }
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toMarkdown(summary, groups, warnings, baseline, fixed) {
  var lines = [];

  lines.push('## Load-and-save report');
  lines.push('');
  lines.push('| | Files |');
  lines.push('|---|---|');
  lines.push('| Checked | ' + summary.files + ' |');
  lines.push('| Unchanged after load and save | ' + summary.unchanged + ' |');
  lines.push('| With differences | ' + summary.changed + ' |');
  lines.push('| Failing to import | ' + summary.failed + ' |');
  lines.push('');

  if (groups.length) {
    lines.push('### Differences by kind');
    lines.push('');
    lines.push('| Kind | Where | Files | Example | Tracked |');
    lines.push('|---|---|---|---|---|');

    groups.forEach(function(g) {
      var known = baseline.losses[g.key];

      lines.push('| ' + [
        KINDS[g.kind],
        '`' + escapeCell(g.subject) + '`',
        g.files.length,
        escapeCell(g.example) + '<br>' + escapeCell(g.files[0]),
        known === undefined ? '**new**' : (known.issue || 'known')
      ].join(' | ') + ' |');
    });

    lines.push('');
  }

  if (fixed.length) {
    lines.push('### No longer found (remove from the baseline)');
    lines.push('');
    fixed.forEach(function(key) {
      lines.push('- `' + escapeCell(key) + '`');
    });
    lines.push('');
  }

  if (warnings.length) {
    lines.push('### Import warnings');
    lines.push('');
    lines.push('| Warning | Files |');
    lines.push('|---|---|');
    warnings.forEach(function(w) {
      lines.push('| ' + escapeCell(w.warning) + ' | ' + w.files + ' |');
    });
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  var args = parseArgs(process.argv.slice(2));

  var files = args.dirs.reduce(function(all, dir) {
    return all.concat(findModels(dir));
  }, []);

  if (!files.length) {
    console.error('no CMMN models found in ' + args.dirs.join(', '));
    process.exit(1);
  }

  var results = [];

  return files.reduce(function(chain, file) {
    return chain.then(function() {
      return checkFile(file).then(function(result) {
        results.push(result);
      });
    });
  }, Promise.resolve()).then(function() {

    var groups = groupDifferences(results),
        warnings = groupWarnings(results),
        baseline = readBaseline(args.baseline);

    var summary = {
      files: results.length,
      unchanged: results.filter(function(r) { return !r.differences.length; }).length,
      changed: results.filter(function(r) {
        return r.differences.length && r.differences[0].kind !== 'import-error';
      }).length,
      failed: results.filter(function(r) {
        return r.differences.some(function(d) { return d.kind === 'import-error'; });
      }).length
    };

    var keys = groups.map(function(g) { return g.key; });

    var newKeys = keys.filter(function(key) {
      return !(key in baseline.losses);
    });

    var fixed = Object.keys(baseline.losses).filter(function(key) {
      return keys.indexOf(key) === -1;
    });

    var markdown = toMarkdown(summary, groups, warnings, baseline, fixed);

    fs.writeFileSync(args.json, JSON.stringify({
      summary: summary,
      groups: groups,
      warnings: warnings,
      files: results
    }, null, 2));

    fs.writeFileSync(args.markdown, markdown + '\n');

    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
    }

    console.log(
      'checked %d files: %d unchanged, %d with differences, %d failing to import',
      summary.files, summary.unchanged, summary.changed, summary.failed);
    console.log('%d kinds of difference (%d new, %d no longer found); report in %s and %s',
      groups.length, newKeys.length, fixed.length, args.markdown, args.json);

    if (args.updateBaseline) {
      var losses = {};

      keys.forEach(function(key) {
        losses[key] = baseline.losses[key] || { issue: null };
      });

      fs.mkdirSync(path.dirname(args.baseline), { recursive: true });
      fs.writeFileSync(args.baseline, JSON.stringify({ losses: losses }, null, 2) + '\n');

      console.log('updated %s', args.baseline);

      return;
    }

    if (newKeys.length) {
      console.error('\nnew differences, not in %s:', args.baseline);
      newKeys.forEach(function(key) {
        console.error('  ' + key);
      });

      process.exitCode = 1;
    }
  });
}

module.exports = {
  checkFile: checkFile
};

if (require.main === module) {
  main().catch(function(err) {
    console.error(err);
    process.exit(1);
  });
}
