import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class HomeScreen extends StatelessWidget {
  final String rol;
  const HomeScreen({super.key, required this.rol});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: rol, paginaActual: 'home'),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Bienvenido a ClassControl',
                    style: GoogleFonts.dmSans(
                        fontSize: 24, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text('Sistema de Gestión Educativa — SENA',
                    style: GoogleFonts.dmSans(
                        fontSize: 14, color: Colors.grey[500])),
                  const SizedBox(height: 32),

                  // Tarjetas de métricas
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 2,
                    children: [
                      _metrica('Fichas Activas', '24',
                          Icons.description, const Color(0xFF39A900)),
                      _metrica('Instructores', '18',
                          Icons.groups, Colors.blue),
                      _metrica('Programas', '6',
                          Icons.school, Colors.orange),
                      _metrica('Ambientes', '12',
                          Icons.meeting_room, Colors.purple),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Rol actual
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF39A900).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: const Color(0xFF39A900).withOpacity(0.3)),
                    ),
                    child: Row(children: [
                      const Icon(Icons.person,
                          color: Color(0xFF39A900)),
                      const SizedBox(width: 12),
                      Text('Rol actual: ${rol.toUpperCase()}',
                        style: GoogleFonts.dmSans(
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF39A900))),
                    ]),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _metrica(String titulo, String valor,
      IconData icono, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05),
              blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      child: Row(children: [
        Container(
          width: 48, height: 48,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icono, color: color, size: 24),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(valor,
              style: GoogleFonts.dmSans(
                  fontSize: 24, fontWeight: FontWeight.w700)),
            Text(titulo,
              style: GoogleFonts.dmSans(
                  fontSize: 12, color: Colors.grey[500])),
          ],
        ),
      ]),
    );
  }
}