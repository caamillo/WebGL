const vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main() {',
    '   fragColor = vertColor;',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
].join('\n')

const fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main() {',
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n')

const initDemo = () => {
    console.log('Initializing demo...')

    const canvas = document.getElementById('canvas')
    const gl = canvas.getContext('webgl')

    if (!gl) gl = canvas.getContext('experimental-webgl')
    if (!gl) alert('WebGL not supported')

    // gl.clearColor(0.75, 0.85, 0.8, 1.0)
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Create Shaders

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
    
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader))
    
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        return console.error('ERROR: linking program', gl.getProgramInfoLog(program))
    
    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        console.error('ERROR: validating program', gl.getProgramInfoLog(program))
    
    // Create Buffer

    const triangleVertices = [
    //  X       Y       R G B
        0.0,    0.5,    0.862, 0.815, 1.0,
        -0.5,   -0.5,   0.709, 0.650, 0.878,
        0.5,    -0.5,   0.6, 0.549, 0.870
    ]

    const triangleVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor')
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from te beginning of a single vertex to this attribute
    )
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from te beginning of a single vertex to this attribute
    )

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation)

    // Main Render Loop

    gl.useProgram(program)
    gl.drawArrays(
        gl.TRIANGLES, // Mode
        0, // Offset
        3 // Count
    )
}