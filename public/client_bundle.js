(() => {
  // game/client/public/client.js
  var miniImageUri = `images/loading/bg.jpg`;
  var fullImageUri = `images/loading/bg.jpg`;
  var blurredBackgroundImage = new Image();
  var fullBackgroundImage = new Image();
  var fullImageRendered = false;
  blurredBackgroundImage.onload = function() {
    if (!fullImageRendered) {
      document.getElementById("loading_background_container").style = `filter: blur(12px); background-image: url(${blurredBackgroundImage.src})`;
    }
  };
  fullBackgroundImage.onload = function() {
    fullImageRendered = true;
    document.getElementById("loading_background_container").style = `background-image: url(${fullBackgroundImage.src})`;
  };
  blurredBackgroundImage.src = miniImageUri;
  fullBackgroundImage.src = fullImageUri;
  var statusElement = document.getElementById("status");
  var progressElement = document.getElementById("progress");
  var spinnerElement = document.getElementById("spinner");
  var Module = {
    noImageDecoding: true,
    noAudioDecoding: true,
    preRun: [],
    postRun: [
      function() {
        Browser.requestFullscreen = function() {
        };
      }
    ],
    print: function() {
      var e = document.getElementById("output");
      return e && (e.value = ""), function(t) {
        arguments.length > 1 && (t = Array.prototype.slice.call(arguments).join(" ")), console.log(t), e && (e.value += t + "\n", e.scrollTop = e.scrollHeight);
      };
    }(),
    printErr: function(e) {
      arguments.length > 1 && (e = Array.prototype.slice.call(arguments).join(" ")), console.error(e);
    },
    canvas: function() {
      var e = document.getElementById("canvas");
      return e.addEventListener("webglcontextlost", function(e2) {
        alert("WebGL context lost. You will need to reload the page."), e2.preventDefault();
      }, false), e;
    }(),
    setStatus: function(e) {
      if (Module.setStatus.last || (Module.setStatus.last = { time: Date.now(), text: "" }), e !== Module.setStatus.last.text) {
        var t = e.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/), n = Date.now();
        t && n - Module.setStatus.last.time < 30 || (Module.setStatus.last.time = n, Module.setStatus.last.text = e, t ? (e = t[1], progressElement.value = 100 * parseInt(t[2]), progressElement.max = 100 * parseInt(t[4]), progressElement.hidden = false, spinnerElement.hidden = false) : (progressElement.value = null, progressElement.max = null, progressElement.hidden = true, e || (spinnerElement.style.display = "none")), statusElement.innerHTML = e);
      }
    },
    totalDependencies: 0,
    monitorRunDependencies: function(e) {
      this.totalDependencies = Math.max(this.totalDependencies, e), Module.setStatus(e ? "Preparing... (" + (this.totalDependencies - e) + "/" + this.totalDependencies + ")" : "All downloads complete.");
    }
  };
  Module.setStatus("Downloading..."), window.onerror = function(e) {
    Module.setStatus("Exception thrown, see JavaScript console"), spinnerElement.style.display = "none", Module.setStatus = function(e2) {
      e2 && Module.printErr("[post-exception status] " + e2);
    };
  };
  function resizeCanvas() {
    let canvas = document.getElementById("canvas");
    canvas.style.width = document.body.clientWidth + "px";
    canvas.style.height = document.body.clientHeight + "px";
  }
  function resizeFramebuffers() {
    if (_updateWindowDimensions !== void 0 && allowCallsToResize) {
      _updateWindowDimensions(document.body.clientWidth, document.body.clientHeight);
    }
  }
  window.addEventListener("load", () => {
    resizeCanvas();
    window.addEventListener("resize", () => {
      resizeCanvas();
      resizeFramebuffers();
    }, false);
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) {
      console.log("webgl not supported.");
      document.getElementById("webgl_unsupported_popup").style.display = "block";
    } else {
      const emscriptenGeneratedJS = document.createElement("script");
      emscriptenGeneratedJS.src = "Simple-Game-Client.js";
      document.body.append(emscriptenGeneratedJS);
    }
  });
  window.Module = Module;
  document.addEventListener("pointerlockerror", lockError, false);
  document.addEventListener("mozpointerlockerror", lockError, false);
  function lockError(e) {
    console.log("Pointer lock failed", e);
  }
  var allowCallsToResize = false;
  Module["onRuntimeInitialized"] = function() {
    document.getElementById("loading_container").style.display = "none";
    allowCallsToResize = true;
  };
})();
