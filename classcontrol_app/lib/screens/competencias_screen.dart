import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class CompetenciasScreen extends StatefulWidget {
  final String rol;
  const CompetenciasScreen({super.key, required this.rol});
  @override
  State<CompetenciasScreen> createState() => _CompetenciasScreenState();
}

class _CompetenciasScreenState extends State<CompetenciasScreen> {
  final _busqueda = TextEditingController();

  final List<Map<String, String>> _competencias = [
    {'codigo': '220501096', 'descripcion': 'Construir software con tecnologias web', 'programa': 'ADSO', 'horas': '120', 'estado': 'Activo'},
    {'codigo': '220501097', 'descripcion': 'Analizar y diseñar sistemas de informacion', 'programa': 'ADSO', 'horas': '96', 'estado': 'Activo'},
    {'codigo': '220501098', 'descripcion': 'Gestionar bases de datos', 'programa': 'ADSO', 'horas': '80', 'estado': 'Activo'},
    {'codigo': '220501099', 'descripcion': 'Desarrollar aplicaciones moviles', 'programa': 'Multimedia', 'horas': '100', 'estado': 'Inactivo'},
    {'codigo': '220501100', 'descripcion': 'Implementar soluciones de inteligencia artificial', 'programa': 'ADSO', 'horas': '120', 'estado': 'Activo'},
  ];

  List<Map<String, String>> get _filtrados {
    final busq = _busqueda.text.toLowerCase();
    return _competencias.where((c) =>
        busq.isEmpty ||
        c['codigo']!.toLowerCase().contains(busq) ||
        c['descripcion']!.toLowerCase().contains(busq)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final lista = _filtrados;
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'competencias'),
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
                          Text('Gestion de Competencias',
                              style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Administra las competencias academicas y tecnicas.',
                              style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                        ],
                      ),
                      if (widget.rol == 'admin')
                        ElevatedButton.icon(
                          onPressed: () => _mostrarModal(context),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: Text('Nueva Competencia', style: GoogleFonts.dmSans(color: Colors.white)),
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
                      hintText: 'Buscar por codigo o descripcion...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                          decoration: const BoxDecoration(
                            color: Color(0xFFF8F9FA),
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(12),
                              topRight: Radius.circular(12),
                            ),
                          ),
                          child: Row(
                            children: [
                              _th('Codigo', 2),
                              _th('Descripcion', 4),
                              _th('Programa', 1),
                              _th('Horas', 1),
                              _th('Estado', 1),
                              if (widget.rol == 'admin') _th('Acciones', 1),
                            ],
                          ),
                        ),
                        ...lista.map((c) => _fila(context, c)),
                        if (lista.isEmpty)
                          Padding(
                            padding: const EdgeInsets.all(32),
                            child: Center(child: Text('No se encontraron competencias.',
                                style: GoogleFonts.dmSans(color: Colors.grey))),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _th(String label, int flex) {
    return Expanded(
      flex: flex,
      child: Text(label,
          style: GoogleFonts.dmSans(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.grey[600])),
    );
  }

  Widget _fila(BuildContext context, Map<String, String> c) {
    final activo = c['estado'] == 'Activo';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFFEEEEEE)))),
      child: Row(
        children: [
          Expanded(flex: 2, child: Text(c['codigo']!,
              style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600))),
          Expanded(flex: 4, child: Text(c['descripcion']!,
              style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 1, child: Text(c['programa']!,
              style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 1, child: Text('${c["horas"]}h',
              style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(
            flex: 1,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: activo ? const Color(0xFF39A900).withOpacity(0.1) : Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(c['estado']!,
                  style: GoogleFonts.dmSans(fontSize: 12,
                      color: activo ? const Color(0xFF39A900) : Colors.red,
                      fontWeight: FontWeight.w600)),
            ),
          ),
          if (widget.rol == 'admin')
            Expanded(
              flex: 1,
              child: Row(children: [
                IconButton(icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blue),
                    onPressed: () => _mostrarModal(context, competencia: c)),
                IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                    onPressed: () => _confirmarEliminar(context, c)),
              ]),
            ),
        ],
      ),
    );
  }

  void _mostrarModal(BuildContext context, {Map<String, String>? competencia}) {
    final codigoCtrl = TextEditingController(text: competencia?['codigo'] ?? '');
    final descCtrl = TextEditingController(text: competencia?['descripcion'] ?? '');
    final horasCtrl = TextEditingController(text: competencia?['horas'] ?? '');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(competencia == null ? 'Nueva Competencia' : 'Editar Competencia',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: SizedBox(
          width: 400,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: codigoCtrl,
                  decoration: InputDecoration(labelText: 'Codigo',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: descCtrl, maxLines: 3,
                  decoration: InputDecoration(labelText: 'Descripcion',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: horasCtrl, keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: 'Horas',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() {
                if (competencia == null) {
                  _competencias.add({'codigo': codigoCtrl.text, 'descripcion': descCtrl.text,
                      'programa': 'ADSO', 'horas': horasCtrl.text, 'estado': 'Activo'});
                } else {
                  competencia['codigo'] = codigoCtrl.text;
                  competencia['descripcion'] = descCtrl.text;
                  competencia['horas'] = horasCtrl.text;
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

  void _confirmarEliminar(BuildContext context, Map<String, String> competencia) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Competencia', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.', style: GoogleFonts.dmSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _competencias.remove(competencia));
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