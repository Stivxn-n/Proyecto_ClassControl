import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class InstructoresScreen extends StatefulWidget {
  final String rol;
  const InstructoresScreen({super.key, required this.rol});
  @override
  State<InstructoresScreen> createState() => _InstructoresScreenState();
}

class _InstructoresScreenState extends State<InstructoresScreen> {
  final _busqueda = TextEditingController();
  String _filtroEstado = '';

  final List<Map<String, String>> _instructores = [
    {'nombre': 'Carlos Perez', 'documento': '12345678', 'email': 'cperez@sena.edu.co', 'especialidad': 'Programacion', 'estado': 'Activo'},
    {'nombre': 'Ana Gomez', 'documento': '23456789', 'email': 'agomez@sena.edu.co', 'especialidad': 'Multimedia', 'estado': 'Activo'},
    {'nombre': 'Luis Torres', 'documento': '34567890', 'email': 'ltorres@sena.edu.co', 'especialidad': 'Gestion', 'estado': 'Inactivo'},
    {'nombre': 'Maria Lopez', 'documento': '45678901', 'email': 'mlopez@sena.edu.co', 'especialidad': 'Electronica', 'estado': 'Activo'},
    {'nombre': 'Jose Ramos', 'documento': '56789012', 'email': 'jramos@sena.edu.co', 'especialidad': 'Contabilidad', 'estado': 'Activo'},
  ];

  List<Map<String, String>> get _filtrados {
    return _instructores.where((i) {
      final busq = _busqueda.text.toLowerCase();
      final coincideBusq = busq.isEmpty ||
          i['nombre']!.toLowerCase().contains(busq) ||
          i['email']!.toLowerCase().contains(busq);
      final coincideEstado =
          _filtroEstado.isEmpty || i['estado'] == _filtroEstado;
      return coincideBusq && coincideEstado;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final lista = _filtrados;
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'instructores'),
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
                          Text('Gestion de Instructores',
                              style: GoogleFonts.dmSans(
                                  fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Administra el equipo docente institucional.',
                              style: GoogleFonts.dmSans(
                                  fontSize: 14, color: Colors.grey[500])),
                        ],
                      ),
                      if (widget.rol == 'admin')
                        ElevatedButton.icon(
                          onPressed: () => _mostrarModal(context),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: Text('Nuevo Instructor',
                              style: GoogleFonts.dmSans(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF39A900),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _busqueda,
                            onChanged: (_) => setState(() {}),
                            decoration: InputDecoration(
                              prefixIcon: const Icon(Icons.search),
                              hintText: 'Buscar por nombre o email...',
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        DropdownButton<String>(
                          value: _filtroEstado.isEmpty ? null : _filtroEstado,
                          hint: Text('Estado', style: GoogleFonts.dmSans(fontSize: 13)),
                          items: ['Activo', 'Inactivo']
                              .map((e) => DropdownMenuItem(value: e, child: Text(e, style: GoogleFonts.dmSans(fontSize: 13))))
                              .toList(),
                          onChanged: (v) => setState(() => _filtroEstado = v ?? ''),
                        ),
                        if (_filtroEstado.isNotEmpty)
                          TextButton(
                            onPressed: () => setState(() => _filtroEstado = ''),
                            child: Text('Limpiar', style: GoogleFonts.dmSans(fontSize: 13)),
                          ),
                      ],
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
                              _th('Nombre', 2),
                              _th('Documento', 1),
                              _th('Email', 2),
                              _th('Especialidad', 2),
                              _th('Estado', 1),
                              if (widget.rol == 'admin') _th('Acciones', 1),
                            ],
                          ),
                        ),
                        ...lista.map((i) => _fila(context, i)),
                        if (lista.isEmpty)
                          Padding(
                            padding: const EdgeInsets.all(32),
                            child: Center(
                              child: Text('No se encontraron instructores.',
                                  style: GoogleFonts.dmSans(color: Colors.grey)),
                            ),
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
          style: GoogleFonts.dmSans(
              fontSize: 12, fontWeight: FontWeight.w600, color: Colors.grey[600])),
    );
  }

  Widget _fila(BuildContext context, Map<String, String> i) {
    final activo = i['estado'] == 'Activo';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFFEEEEEE)))),
      child: Row(
        children: [
          Expanded(flex: 2, child: Row(
            children: [
              CircleAvatar(
                backgroundColor: const Color(0xFF39A900).withOpacity(0.15),
                radius: 18,
                child: Text(i['nombre']![0],
                    style: GoogleFonts.dmSans(
                        color: const Color(0xFF39A900), fontWeight: FontWeight.w600)),
              ),
              const SizedBox(width: 10),
              Text(i['nombre']!, style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600)),
            ],
          )),
          Expanded(flex: 1, child: Text(i['documento']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 2, child: Text(i['email']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 2, child: Text(i['especialidad']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(
            flex: 1,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: activo ? const Color(0xFF39A900).withOpacity(0.1) : Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(i['estado']!,
                  style: GoogleFonts.dmSans(
                      fontSize: 12,
                      color: activo ? const Color(0xFF39A900) : Colors.red,
                      fontWeight: FontWeight.w600)),
            ),
          ),
          if (widget.rol == 'admin')
            Expanded(
              flex: 1,
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blue),
                    onPressed: () => _mostrarModal(context, instructor: i),
                    tooltip: 'Editar',
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                    onPressed: () => _confirmarEliminar(context, i),
                    tooltip: 'Eliminar',
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  void _mostrarModal(BuildContext context, {Map<String, String>? instructor}) {
    final nombreCtrl = TextEditingController(text: instructor?['nombre'] ?? '');
    final docCtrl = TextEditingController(text: instructor?['documento'] ?? '');
    final emailCtrl = TextEditingController(text: instructor?['email'] ?? '');
    final espCtrl = TextEditingController(text: instructor?['especialidad'] ?? '');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(instructor == null ? 'Nuevo Instructor' : 'Editar Instructor',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: SizedBox(
          width: 400,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nombreCtrl,
                  decoration: InputDecoration(labelText: 'Nombre completo',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: docCtrl,
                  decoration: InputDecoration(labelText: 'Documento',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: emailCtrl,
                  decoration: InputDecoration(labelText: 'Email',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: espCtrl,
                  decoration: InputDecoration(labelText: 'Especialidad',
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
                if (instructor == null) {
                  _instructores.add({
                    'nombre': nombreCtrl.text,
                    'documento': docCtrl.text,
                    'email': emailCtrl.text,
                    'especialidad': espCtrl.text,
                    'estado': 'Activo',
                  });
                } else {
                  instructor['nombre'] = nombreCtrl.text;
                  instructor['documento'] = docCtrl.text;
                  instructor['email'] = emailCtrl.text;
                  instructor['especialidad'] = espCtrl.text;
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

  void _confirmarEliminar(BuildContext context, Map<String, String> instructor) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Instructor', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.', style: GoogleFonts.dmSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _instructores.remove(instructor));
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