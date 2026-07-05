import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class AmbientesScreen extends StatefulWidget {
  final String rol;
  const AmbientesScreen({super.key, required this.rol});
  @override
  State<AmbientesScreen> createState() => _AmbientesScreenState();
}

class _AmbientesScreenState extends State<AmbientesScreen> {
  final _busqueda = TextEditingController();

  final List<Map<String, String>> _ambientes = [
    {'numero': '101', 'nombre': 'Laboratorio de Software', 'tipo': 'Laboratorio', 'capacidad': '30', 'estado': 'Disponible'},
    {'numero': '102', 'nombre': 'Aula Multimedia', 'tipo': 'Aula', 'capacidad': '25', 'estado': 'Disponible'},
    {'numero': '103', 'nombre': 'Sala de Conferencias', 'tipo': 'Sala', 'capacidad': '50', 'estado': 'Ocupado'},
    {'numero': '104', 'nombre': 'Laboratorio Electronica', 'tipo': 'Laboratorio', 'capacidad': '20', 'estado': 'Disponible'},
    {'numero': '105', 'nombre': 'Aula Virtual', 'tipo': 'Aula', 'capacidad': '35', 'estado': 'Mantenimiento'},
  ];

  List<Map<String, String>> get _filtrados {
    final busq = _busqueda.text.toLowerCase();
    return _ambientes.where((a) =>
        busq.isEmpty ||
        a['nombre']!.toLowerCase().contains(busq) ||
        a['numero']!.toLowerCase().contains(busq)).toList();
  }

  Color _colorEstado(String estado) {
    switch (estado) {
      case 'Disponible': return const Color(0xFF39A900);
      case 'Ocupado': return Colors.red;
      case 'Mantenimiento': return Colors.orange;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final lista = _filtrados;
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'ambientes'),
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
                          Text('Gestion de Ambientes',
                              style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Administra los espacios de formacion.',
                              style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                        ],
                      ),
                      if (widget.rol == 'admin')
                        ElevatedButton.icon(
                          onPressed: () => _mostrarModal(context),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: Text('Nuevo Ambiente', style: GoogleFonts.dmSans(color: Colors.white)),
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
                      hintText: 'Buscar ambiente...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 1.8,
                    ),
                    itemCount: lista.length,
                    itemBuilder: (context, i) {
                      final a = lista[i];
                      final color = _colorEstado(a['estado']!);
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                          border: Border.all(color: color.withOpacity(0.3)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Ambiente ${a["numero"]}',
                                    style: GoogleFonts.dmSans(fontSize: 16, fontWeight: FontWeight.w700)),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: color.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(a['estado']!,
                                      style: GoogleFonts.dmSans(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(a['nombre']!, style: GoogleFonts.dmSans(fontSize: 13, color: Colors.grey[600])),
                            const Spacer(),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(children: [
                                  const Icon(Icons.people_outline, size: 14, color: Colors.grey),
                                  const SizedBox(width: 4),
                                  Text('${a["capacidad"]} personas',
                                      style: GoogleFonts.dmSans(fontSize: 12, color: Colors.grey)),
                                ]),
                                if (widget.rol == 'admin')
                                  Row(children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit_outlined, size: 16, color: Colors.blue),
                                      onPressed: () => _mostrarModal(context, ambiente: a),
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                    ),
                                    const SizedBox(width: 8),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline, size: 16, color: Colors.red),
                                      onPressed: () => _confirmarEliminar(context, a),
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                    ),
                                  ]),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  if (lista.isEmpty)
                    Center(child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Text('No se encontraron ambientes.', style: GoogleFonts.dmSans(color: Colors.grey)),
                    )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _mostrarModal(BuildContext context, {Map<String, String>? ambiente}) {
    final numeroCtrl = TextEditingController(text: ambiente?['numero'] ?? '');
    final nombreCtrl = TextEditingController(text: ambiente?['nombre'] ?? '');
    final capCtrl = TextEditingController(text: ambiente?['capacidad'] ?? '');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(ambiente == null ? 'Nuevo Ambiente' : 'Editar Ambiente',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: numeroCtrl,
                decoration: InputDecoration(labelText: 'Numero',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 12),
            TextField(controller: nombreCtrl,
                decoration: InputDecoration(labelText: 'Nombre',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
            const SizedBox(height: 12),
            TextField(controller: capCtrl,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(labelText: 'Capacidad',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() {
                if (ambiente == null) {
                  _ambientes.add({'numero': numeroCtrl.text, 'nombre': nombreCtrl.text,
                      'tipo': 'Aula', 'capacidad': capCtrl.text, 'estado': 'Disponible'});
                } else {
                  ambiente['numero'] = numeroCtrl.text;
                  ambiente['nombre'] = nombreCtrl.text;
                  ambiente['capacidad'] = capCtrl.text;
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

  void _confirmarEliminar(BuildContext context, Map<String, String> ambiente) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Ambiente', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.', style: GoogleFonts.dmSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _ambientes.remove(ambiente));
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