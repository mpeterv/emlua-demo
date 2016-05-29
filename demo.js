window.onload = function() {
  function log(str) {
    var output = document.getElementById('output');
    output.value += str + '\n';
    output.scrollTop = output.scrollHeight;
  }

  function newState() {
    var state = emlua.state();
    state.aux.openlibs();
    state.aux.loadstring('package.loaded.io = nil; package.loaded.os = nil; io = nil; os = nil;')
    state.call(0, 0);
    state.aux.loadstring('local log, concat, tostring = ..., table.concat, tostring;' +
      'function print(...) local args = {};' +
      'for i = 1, select("#", ...) do args[i] = tostring(select(i, ...)) end;' +
      'log(concat(args, "\t")) end'
    )
    state.util.pushjsfunction(function(st) {
      log(st.tostring(1));
      return 0;
    })
    state.call(1, 0);
    return state;
  }

  var state = newState();

  document.getElementById('run').onclick = function() {
    state.util.pushjsfunction(function(st) {
      log('Error:');
      log(st.tostring(1));
      return 1;
    })

    var loaded = state.aux.loadstring(document.getElementById('input').value);

    if (loaded === 0) {
      var startMillis = performance.now();
      state.pcall(0, 0, -2);
      var endMillis = performance.now();
      var diffSeconds = (endMillis - startMillis) / 1000;
      document.getElementById('status').innerHTML = 'Completed in ' +
        diffSeconds + ' seconds. Output:';
    } else {
      log('Compilation error:');
      log(state.tostring(-1));
    }

    state.settop(0);
  }

  document.getElementById('clear').onclick = function() {
    document.getElementById('output').value = '';
  }

  document.getElementById('reset').onclick = function() {
    state.close();
    state = newState();
  }
}
