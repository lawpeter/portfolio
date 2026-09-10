"""Convert Peter-supplied CAD. Run in an environment with cadquery, trimesh,
numpy, matplotlib, VTK and Pillow. Originals remain in ignored raw-assets/.
Colors are presentation choices, not specifications for manufactured finish.
"""
from pathlib import Path
import cadquery as cq
import trimesh
import numpy as np
import matplotlib

ROOT = Path(__file__).resolve().parents[1]

def render(meshes, path, elev=28, azim=-65):
    import vtk
    from vtk.util.numpy_support import numpy_to_vtk, numpy_to_vtkIdTypeArray
    from PIL import Image
    renderer=vtk.vtkRenderer(); renderer.SetBackground(20/255,19/255,18/255)
    for m in meshes:
        points=vtk.vtkPoints();points.SetData(numpy_to_vtk(np.asarray(m.vertices),deep=True))
        cells=vtk.vtkCellArray()
        cells.SetCells(len(m.faces),numpy_to_vtkIdTypeArray(np.column_stack([np.full(len(m.faces),3),m.faces]).astype(np.int64).ravel(),deep=True))
        poly=vtk.vtkPolyData();poly.SetPoints(points);poly.SetPolys(cells)
        normals=vtk.vtkPolyDataNormals();normals.SetInputData(poly);normals.SetFeatureAngle(35);normals.SplittingOn();normals.ConsistencyOn()
        mapper=vtk.vtkPolyDataMapper();mapper.SetInputConnection(normals.GetOutputPort())
        actor=vtk.vtkActor();actor.SetMapper(mapper);actor.GetProperty().SetColor(*(m.visual.face_colors[0,:3]/255));actor.GetProperty().SetAmbient(.25);actor.GetProperty().SetDiffuse(.75)
        renderer.AddActor(actor)
    vertices=np.vstack([m.vertices for m in meshes]);mid=(vertices.min(axis=0)+vertices.max(axis=0))/2
    el,az=np.deg2rad([elev,azim]);direction=np.array([np.cos(el)*np.cos(az),np.cos(el)*np.sin(az),np.sin(el)])
    right=np.cross(direction,[0,0,1]);right/=np.linalg.norm(right);up=np.cross(right,direction)
    mid = mid + right*((vertices@right).min()/2+(vertices@right).max()/2-mid@right) + up*((vertices@up).min()/2+(vertices@up).max()/2-mid@up)
    scale=max(np.ptp(vertices@up)/2,np.ptp(vertices@right)/2/(12/7))*1.15
    camera=renderer.GetActiveCamera();camera.SetPosition(*(mid+direction*np.ptp(vertices,axis=0).max()*3));camera.SetFocalPoint(*mid);camera.SetViewUp(0,0,1);camera.ParallelProjectionOn();camera.SetParallelScale(scale)
    window=vtk.vtkRenderWindow();window.SetOffScreenRendering(1);window.SetSize(1800,1050);window.AddRenderer(renderer);window.SetMultiSamples(8)
    renderer.ResetCameraClippingRange();window.Render()
    capture=vtk.vtkWindowToImageFilter();capture.SetInput(window);capture.Update()
    path.parent.mkdir(parents=True,exist_ok=True)
    writer=vtk.vtkPNGWriter();writer.SetFileName('/tmp/portfolio-cad-render.png');writer.SetInputConnection(capture.GetOutputPort());writer.Write()
    Image.open('/tmp/portfolio-cad-render.png').save(path,quality=90)
    window.Finalize()

def web_model(meshes,path):
    scene=trimesh.Scene()
    # CAD Z-up to glTF Y-up, preserving all relative part placements.
    rotation=trimesh.transformations.rotation_matrix(-np.pi/2,[1,0,0])
    for i,m in enumerate(meshes):
        m=m.copy(); m.apply_transform(rotation);m.apply_scale(.001)
        scene.add_geometry(m,node_name=f'part-{i}',geom_name=f'part-{i}')
    path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(scene.export(file_type='glb'))

if __name__ == '__main__':
    shape=cq.importers.importStep(str(ROOT/'raw-assets/keyboard/keyboard-assembly.step'))
    meshes=[]
    palette=['#c7c0b4','#777d80','#a9a399','#4d7565']
    for i,solid in enumerate(shape.solids().vals()):
        vertices,faces=solid.tessellate(.15,.2)
        mesh=trimesh.Trimesh(vertices=[v.toTuple() for v in vertices],faces=faces,process=True)
        # Onshape keyboard exports use Y-up; convert to Z-up for plotting.
        mesh.apply_transform(trimesh.transformations.rotation_matrix(np.pi/2,[1,0,0]))
        mesh.visual.face_colors=(matplotlib.colors.to_rgba_array(palette[i%len(palette)])[0]*255).astype(np.uint8)
        meshes.append(mesh)
        print(i,mesh.bounds.tolist(),len(mesh.faces),flush=True)
    web_model(meshes,ROOT/'public/models/keyboard/keyboard-assembly.glb')
    render(meshes,ROOT/'public/photos/keyboard/enclosure-assembly.webp')
    base=trimesh.load(ROOT/'raw-assets/keyboard/case-base.stl')
    base.apply_transform(trimesh.transformations.rotation_matrix(np.pi/2,[1,0,0]))
    base.visual.face_colors=[173,169,160,255]
    render([base],ROOT/'public/photos/keyboard/enclosure-base.webp',elev=45)
    mount=trimesh.load(ROOT/'raw-assets/stair-robot/electronics-mount.stl')
    mount.visual.face_colors=[173,169,160,255]
    render([mount],ROOT/'public/photos/stair-robot/electronics-mount.webp',elev=-30)
    web_model([mount],ROOT/'public/models/stair-robot/electronics-mount.glb')
