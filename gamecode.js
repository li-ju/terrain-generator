document.onkeydown = OnKeyIsDown;
var renderer, scene, camera;

var columns, rows;
var scale = 20;
var size = 10;

var geometry;
var material;
var terrain;
var bioColors = false;

setup();
animate();

function generateTerrain()
{
    // Geometry
    columns = 30 + size;
    rows = 30 + size;
    scale = 50 + size;
    var halfScale = scale /2;
    var segSize = scale /columns;

    noise.seed(Math.random());

    geometry = new THREE.BufferGeometry();
    var indices = [];
    var vertices = [];
    var normals = [];
    var colors = [];

    // generate vertices (with normals and color)
    for(var y = 0; y <= rows; y++)
    {
        var vY = (y * segSize) - halfScale;
        for(var x = 0; x <= columns; x++)
        {
            var vX = (x * segSize) - halfScale;
            //var vZ = 4.0 * noise.simplex2(x*0.1,y*0.1);
            var vZ = 20 *  noise.perlin2(x*0.1,y*0.1);
            vertices.push(vX,-vY,vZ);
            normals.push(0,0,1);
            
            var r = 1; //(vX / scale) + 0.5;
            var g = 0; //(vY / scale) + 0.5;
            var b = 1;

            if(bioColors)
            {
                if(vZ < -1.0)
                {
                    r = 0.494; 
                    g = 0.650;
                    b = 0.349;
                    
                }
                else if(vZ < 0.6)
                {
                    r = 0.394; 
                    g = 0.550;
                    b = 0.249;
                
                }
                else if(vZ < 7.0)
                {
                    r = 0.470;
                    g = 0.427;
                    b = 0.407;
                }
                else
                {
                    r = 0.803;
                    g = 0.8;
                    b = 0.796;
                }
            }
            else
            {
                r = ( vZ / scale) + 0.3;
                g = ( vZ / scale) + 0.3;
                b = ( vZ / scale) + 0.3;
            }
           colors.push(r,g,b);
        }
    }
    // Generate indices
    for(var y = 0; y < rows; y++)
    {
        for(var x = 0; x < columns; x++)
        {
            var a = y * (rows + 1) + (x + 1);
            var b = y * (rows + 1) + x;
            var c = (y + 1) * (rows + 1) + x;
            var d = (y + 1) * (rows + 1) + (x + 1);

            // Generate 2 faces (triangles)
            indices.push(a,b,d);
            indices.push(b,c,d);
        }
    }
    geometry.setIndex(indices);
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));
    geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ));
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ));

    material = new THREE.MeshPhongMaterial( {
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors
        } );

    terrain = new THREE.Mesh( geometry, material );
    scene.add(terrain);

    terrain.rotateX(-Math.PI/3);
}

function regenerateTerrain()
{
    geometry.dispose();
    material.dispose();
    scene.remove(terrain);
    generateTerrain();
}

function setup(){
    var width = window.innerWidth*0.99;
    var height = window.innerHeight*0.99;
    var aspect = width/height;
    columns = size/scale;
    rows = size/scale;

    // Renderer
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Light
    var light = new THREE.HemisphereLight();
    scene.add( light );

    // Camera
    camera = new THREE.PerspectiveCamera(27, aspect, 1, 3500);
    camera.position.z = 100;
    scene.add(camera);

    generateTerrain();
}

function update(){

}

function render(){
    var time = Date.now() * 0.001;
    terrain.rotation.z = time * 0.5;
    renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    update();
    render();
}

function OnKeyIsDown(key)
{
    switch(key.keyCode)
    {
        case 32: // space
            regenerateTerrain();
            break;
        case 67: // c
            bioColors = !bioColors;
            regenerateTerrain();
            break;
        default:
            break;
    }
}

