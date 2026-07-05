import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class ProgramasScreen extends StatefulWidget {
  final String rol;
  const ProgramasScreen({super.key, required this.rol});
  @override
  State<ProgramasScreen> createState() => _ProgramasScreenState();
}

class _ProgramasScreenState extends State<ProgramasScreen> {
  final _busqueda = TextEditingController();
  String _filtroNivel = '';

  final List<Map<String, String>> _programas = [
    {'codigo': '228106', 'nombre': 'Analisis y Desarrollo de Software', 'nivel': 'Tecnologo', 'version': '102', 'estado': 'Activo'},
    {'codigo': '921', 'nombre': 'Multimedia', 'nivel': 'Tecnico', 'version': '101', 'estado': 'Activo'},
    {'codigo': '623401', 'nombre': 'Gestion Empresarial', 'nivel': 'Tecnologo', 'version': '103', 'estado': 'Inactivo'},
    {'codigo': '523119', 'nombre': 'Electronica', 'nivel': 'Tecnico', 'version': '100', 'estado': 'Activo'},
    {'codigo': '134207', 'nombre': 'Contabilidad', 'nivel': 'Tecnologo', 'version': '102', 'estado': 'Activo'},
  ];

  List<Map<String, String>> get _filtrados {
    return _programas.where((p) {
      final busq = _busqueda.text.toLowerCase();
      final coincideBusq = busq.isEmpty ||
          p['nombre']!.toLowerCase().contains(busq) ||
          p['codigo']!.toLowerCase().contains(busq);
      final coincideNivel = _filtroNivel.isEmpty || p['nivel'] == _filtroNivel;
      return coincideBusq && coincideNivel;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final lista = _filtrados;
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'programas'),
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
                          Text('Gestion de Programas',
                              style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Administra la oferta educativa.',
                              style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                        ],
                      ),
                      if (widget.rol == 'admin')
                        ElevatedButton.icon(
                          onPressed: () => _mostrarModal(context),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: Text('Nuevo Programa', style: GoogleFonts.dmSans(color: Colors.white)),
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
                      hintText: 'Buscar...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...lista.map((p) => _fila(context, p)),
                  if (lista.isEmpty)
                    Center(child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Text('No se encontraron programas.', style: GoogleFonts.dmSans(color: Colors.grey)),
                    )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _fila(BuildContext context, Map<String, String> p) {
    final activo = p['estado'] == 'Activo';
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        title: Text(p['nombre']!, style: GoogleFonts.dmSans(fontWeight: FontWeight.w600)),
        subtitle: Text('${p["codigo"]} | ${p["nivel"]} | v${p["version"]}', style: GoogleFonts.dmSans(fontSize: 12)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: activo ? const Color(0xFF39A900).withOpacity(0.1) : Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(p['estado']!,
                  style: GoogleFonts.dmSans(fontSize: 12,
                      color: activo ? const Color(0xFF39A900) : Colors.red,
                      fontWeight: FontWeight.w600)),
            ),
            if (widget.rol == 'admin') ...[
              IconButton(icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blue),
                  onPressed: () => _mostrarModal(context, programa: p)),
              IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                  onPressed: () => _confirmarEliminar(context, p)),
            ],
          ],
        ),
      ),
    );
  }

  void _mostrarModal(BuildContext context, {Map<String, String>? programa}) {
    final codigoCtrl = TextEditingController(text: programa?['codigo'] ?? '');
    final nombreCtrl = TextEditingController(text: programa?['nombre'] ?? '');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(programa == null ? 'Nuevo Programa' : 'Editar Programa',
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
                if (programa == null) {
                  _programas.add({'codigo': codigoCtrl.text, 'nombre': nombreCtrl.text,
                      'nivel': 'Tecnologo', 'version': '1', 'estado': 'Activo'});
                } else {
                  programa['codigo'] = codigoCtrl.text;
                  programa['nombre'] = nombreCtrl.text;
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

  void _confirmarEliminar(BuildContext context, Map<String, String> programa) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Programa', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.', style: GoogleFonts.dmSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _programas.remove(programa));
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