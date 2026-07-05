import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class ProgramacionScreen extends StatefulWidget {
  final String rol;
  const ProgramacionScreen({super.key, required this.rol});
  @override
  State<ProgramacionScreen> createState() => _ProgramacionScreenState();
}

class _ProgramacionScreenState extends State<ProgramacionScreen> {
  final List<Map<String, String>> _programaciones = [
    {'materia': 'Programacion Web', 'instructor': 'Carlos Perez', 'dia': 'Lunes', 'hora': '07:00 - 10:00', 'ficha': '2550455', 'ambiente': '101', 'area': 'Tecnica'},
    {'materia': 'Bases de Datos', 'instructor': 'Ana Gomez', 'dia': 'Martes', 'hora': '10:00 - 01:00', 'ficha': '2550456', 'ambiente': '102', 'area': 'Tecnica'},
    {'materia': 'Ingles Tecnico', 'instructor': 'Luis Torres', 'dia': 'Miercoles', 'hora': '02:00 - 05:00', 'ficha': '2550455', 'ambiente': '103', 'area': 'Idiomas'},
    {'materia': 'Matematicas', 'instructor': 'Maria Lopez', 'dia': 'Jueves', 'hora': '07:00 - 10:00', 'ficha': '2550457', 'ambiente': '104', 'area': 'Matematicas'},
    {'materia': 'Etica', 'instructor': 'Jose Ramos', 'dia': 'Viernes', 'hora': '10:00 - 01:00', 'ficha': '2550458', 'ambiente': '105', 'area': 'Transversales'},
  ];

  Color _colorArea(String area) {
    switch (area) {
      case 'Tecnica': return Colors.green;
      case 'Idiomas': return Colors.blue;
      case 'Matematicas': return Colors.orange;
      case 'Transversales': return Colors.purple;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'programacion'),
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
                          Text('Programacion de Instructores',
                              style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Calendario semanal de clases.',
                              style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                        ],
                      ),
                      if (widget.rol == 'admin')
                        ElevatedButton.icon(
                          onPressed: () => _mostrarModal(context),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: Text('Nueva Programacion', style: GoogleFonts.dmSans(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF39A900),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Leyenda
                  Row(
                    children: [
                      _leyenda('Tecnica', Colors.green),
                      const SizedBox(width: 16),
                      _leyenda('Idiomas', Colors.blue),
                      const SizedBox(width: 16),
                      _leyenda('Matematicas', Colors.orange),
                      const SizedBox(width: 16),
                      _leyenda('Transversales', Colors.purple),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Tabla
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
                              _th('Materia', 2),
                              _th('Instructor', 2),
                              _th('Dia', 1),
                              _th('Hora', 2),
                              _th('Ficha', 1),
                              _th('Ambiente', 1),
                              _th('Area', 1),
                              if (widget.rol == 'admin') _th('', 1),
                            ],
                          ),
                        ),
                        ..._programaciones.map((p) => _fila(context, p)),
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

  Widget _leyenda(String label, Color color) {
    return Row(children: [
      Container(width: 12, height: 12,
          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3))),
      const SizedBox(width: 6),
      Text(label, style: GoogleFonts.dmSans(fontSize: 12, color: Colors.grey[600])),
    ]);
  }

  Widget _th(String label, int flex) {
    return Expanded(
      flex: flex,
      child: Text(label,
          style: GoogleFonts.dmSans(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.grey[600])),
    );
  }

  Widget _fila(BuildContext context, Map<String, String> p) {
    final color = _colorArea(p['area']!);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFFEEEEEE)))),
      child: Row(
        children: [
          Expanded(flex: 2, child: Row(children: [
            Container(width: 4, height: 36, decoration: BoxDecoration(
                color: color, borderRadius: BorderRadius.circular(2))),
            const SizedBox(width: 10),
            Text(p['materia']!, style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600)),
          ])),
          Expanded(flex: 2, child: Text(p['instructor']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 1, child: Text(p['dia']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 2, child: Text(p['hora']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 1, child: Text(p['ficha']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 1, child: Text(p['ambiente']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 1, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(p['area']!,
                style: GoogleFonts.dmSans(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
          )),
          if (widget.rol == 'admin')
            Expanded(flex: 1, child: Row(children: [
              IconButton(icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blue),
                  onPressed: () => _mostrarModal(context, programacion: p)),
              IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                  onPressed: () => _confirmarEliminar(context, p)),
            ])),
        ],
      ),
    );
  }

  void _mostrarModal(BuildContext context, {Map<String, String>? programacion}) {
    final materiaCtrl = TextEditingController(text: programacion?['materia'] ?? '');
    final instructorCtrl = TextEditingController(text: programacion?['instructor'] ?? '');
    final fichaCtrl = TextEditingController(text: programacion?['ficha'] ?? '');
    final ambienteCtrl = TextEditingController(text: programacion?['ambiente'] ?? '');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(programacion == null ? 'Nueva Programacion' : 'Editar Programacion',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: SizedBox(
          width: 400,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: materiaCtrl,
                  decoration: InputDecoration(labelText: 'Materia',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: instructorCtrl,
                  decoration: InputDecoration(labelText: 'Instructor',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: fichaCtrl,
                  decoration: InputDecoration(labelText: 'Ficha',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
              const SizedBox(height: 12),
              TextField(controller: ambienteCtrl,
                  decoration: InputDecoration(labelText: 'Ambiente',
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
                if (programacion == null) {
                  _programaciones.add({
                    'materia': materiaCtrl.text,
                    'instructor': instructorCtrl.text,
                    'dia': 'Lunes',
                    'hora': '07:00 - 10:00',
                    'ficha': fichaCtrl.text,
                    'ambiente': ambienteCtrl.text,
                    'area': 'Tecnica',
                  });
                } else {
                  programacion['materia'] = materiaCtrl.text;
                  programacion['instructor'] = instructorCtrl.text;
                  programacion['ficha'] = fichaCtrl.text;
                  programacion['ambiente'] = ambienteCtrl.text;
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

  void _confirmarEliminar(BuildContext context, Map<String, String> p) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Programacion', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.', style: GoogleFonts.dmSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _programaciones.remove(p));
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