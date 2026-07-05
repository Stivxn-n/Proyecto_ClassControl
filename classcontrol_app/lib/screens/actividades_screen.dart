import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class ActividadesScreen extends StatefulWidget {
  final String rol;
  const ActividadesScreen({super.key, required this.rol});
  @override
  State<ActividadesScreen> createState() => _ActividadesScreenState();
}

class _ActividadesScreenState extends State<ActividadesScreen> {
  final _busqueda = TextEditingController();

  final List<Map<String, String>> _actividades = [
    {'codigo': 'ACT001', 'nombre': 'Desarrollo de aplicacion web', 'competencia': '220501096', 'tipo': 'Proyecto', 'estado': 'Activo'},
    {'codigo': 'ACT002', 'nombre': 'Taller de bases de datos', 'competencia': '220501098', 'tipo': 'Taller', 'estado': 'Activo'},
    {'codigo': 'ACT003', 'nombre': 'Evaluacion de logica de programacion', 'competencia': '220501097', 'tipo': 'Evaluacion', 'estado': 'Inactivo'},
    {'codigo': 'ACT004', 'nombre': 'Proyecto integrador', 'competencia': '220501096', 'tipo': 'Proyecto', 'estado': 'Activo'},
    {'codigo': 'ACT005', 'nombre': 'Exposicion de resultados', 'competencia': '220501100', 'tipo': 'Exposicion', 'estado': 'Activo'},
  ];

  List<Map<String, String>> get _filtrados {
    final busq = _busqueda.text.toLowerCase();
    return _actividades.where((a) =>
        busq.isEmpty ||
        a['nombre']!.toLowerCase().contains(busq) ||
        a['codigo']!.toLowerCase().contains(busq)).toList();
  }

  Color _colorTipo(String tipo) {
    switch (tipo) {
      case 'Proyecto': return Colors.blue;
      case 'Taller': return Colors.orange;
      case 'Evaluacion': return Colors.red;
      case 'Exposicion': return Colors.purple;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final lista = _filtrados;
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'actividades'),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Gestion de Actividades',
                              style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Administra las actividades de aprendizaje.',
                              style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                        ],
                      ),
                      if (widget.rol == 'admin' || widget.rol == 'instructor')
                        ElevatedButton.icon(
                          onPressed: () => _mostrarModal(context),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: Text('Nueva Actividad', style: GoogleFonts.dmSans(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF39A900),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _busqueda,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.search),
                      hintText: 'Buscar actividad...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...lista.map((a) => _tarjeta(context, a)),
                  if (lista.isEmpty)
                    Center(child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Text('No se encontraron actividades.',
                          style: GoogleFonts.dmSans(color: Colors.grey)),
                    )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tarjeta(BuildContext context, Map<String, String> a) {
    final activo = a['estado'] == 'Activo';
    final colorTipo = _colorTipo(a['tipo']!);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
        border: Border(left: BorderSide(color: colorTipo, width: 4)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: colorTipo.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(a['tipo']!,
                        style: GoogleFonts.dmSans(fontSize: 11, color: colorTipo, fontWeight: FontWeight.w600)),
                  ),
                  const SizedBox(width: 8),
                  Text(a['codigo']!,
                      style: GoogleFonts.dmSans(fontSize: 12, color: Colors.grey)),
                ]),
                const SizedBox(height: 6),
                Text(a['nombre']!,
                    style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text('Competencia: ${a["competencia"]}',
                    style: GoogleFonts.dmSans(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: activo ? const Color(0xFF39A900).withOpacity(0.1) : Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(a['estado']!,
                    style: GoogleFonts.dmSans(fontSize: 12,
                        color: activo ? const Color(0xFF39A900) : Colors.red,
                        fontWeight: FontWeight.w600)),
              ),
              if (widget.rol == 'admin' || widget.rol == 'instructor')
                Row(children: [
                  IconButton(icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blue),
                      onPressed: () => _mostrarModal(context, actividad: a)),
                  IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                      onPressed: () => _confirmarEliminar(context, a)),
                ]),
            ],
          ),
        ],
      ),
    );
  }

  void _mostrarModal(BuildContext context, {Map<String, String>? actividad}) {
    final codigoCtrl = TextEditingController(text: actividad?['codigo'] ?? '');
    final nombreCtrl = TextEditingController(text: actividad?['nombre'] ?? '');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(actividad == null ? 'Nueva Actividad' : 'Editar Actividad',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: codigoCtrl,
                decoration: InputDecoration(labelText: 'Codigo',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 12),
            TextField(controller: nombreCtrl,
                decoration: InputDecoration(labelText: 'Nombre',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() {
                if (actividad == null) {
                  _actividades.add({'codigo': codigoCtrl.text, 'nombre': nombreCtrl.text,
                      'competencia': '', 'tipo': 'Taller', 'estado': 'Activo'});
                } else {
                  actividad['codigo'] = codigoCtrl.text;
                  actividad['nombre'] = nombreCtrl.text;
                }
              });
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF39A900)),
            child: Text('Guardar', style: GoogleFonts.dmSans(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _confirmarEliminar(BuildContext context, Map<String, String> actividad) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Actividad', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.', style: GoogleFonts.dmSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _actividades.remove(actividad));
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('Eliminar', style: GoogleFonts.dmSans(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}