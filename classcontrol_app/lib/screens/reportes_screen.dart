import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class ReportesScreen extends StatelessWidget {
  final String rol;
  const ReportesScreen({super.key, required this.rol});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: rol, paginaActual: 'reportes'),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Reportes y Consultas',
                      style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                  Text('Genera y descarga reportes del sistema.',
                      style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 32),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 2.5,
                    children: [
                      _tarjetaReporte(context, 'Reporte de Fichas',
                          'Lista completa de fichas activas e inactivas.',
                          Icons.description, Colors.blue),
                      _tarjetaReporte(context, 'Reporte de Instructores',
                          'Listado de instructores y su programacion.',
                          Icons.groups, Colors.green),
                      _tarjetaReporte(context, 'Reporte de Ambientes',
                          'Estado actual de todos los ambientes.',
                          Icons.meeting_room, Colors.orange),
                      _tarjetaReporte(context, 'Reporte de Programacion',
                          'Horario semanal de clases por instructor.',
                          Icons.calendar_month, Colors.purple),
                      _tarjetaReporte(context, 'Reporte de Competencias',
                          'Listado de competencias por programa.',
                          Icons.track_changes, Colors.red),
                      _tarjetaReporte(context, 'Reporte General',
                          'Resumen completo del sistema educativo.',
                          Icons.analytics, const Color(0xFF39A900)),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tarjetaReporte(BuildContext context, String titulo,
      String descripcion, IconData icono, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Row(
        children: [
          Container(
            width: 48, height: 48,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icono, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(titulo, style: GoogleFonts.dmSans(
                    fontSize: 14, fontWeight: FontWeight.w700)),
                Text(descripcion, style: GoogleFonts.dmSans(
                    fontSize: 12, color: Colors.grey),
                    maxLines: 2, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          IconButton(
            icon: Icon(Icons.download, color: color),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Descargando $titulo...',
                    style: GoogleFonts.dmSans()),
                    backgroundColor: color),
              );
            },
          ),
        ],
      ),
    );
  }
}