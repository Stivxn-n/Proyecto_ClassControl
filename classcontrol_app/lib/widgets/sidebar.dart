import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Sidebar extends StatelessWidget {
  final String rol;
  final String paginaActual;
  const Sidebar({super.key, required this.rol, required this.paginaActual});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 240,
      color: const Color(0xFF1A1A2E),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            child: Row(children: [
              Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF39A900),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.grid_view_rounded,
                    color: Colors.white, size: 22),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ClassControl',
                    style: GoogleFonts.dmSans(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w700)),
                  Text('Gestión Educativa',
                    style: GoogleFonts.dmSans(
                        color: Colors.white54, fontSize: 11)),
                ],
              ),
            ]),
          ),

          // Nav items
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: [
                _navItem(context, 'Inicio', Icons.dashboard, '/home'),
                _navItem(context, 'Fichas', Icons.description, '/fichas'),
                _navItem(context, 'Instructores', Icons.groups, '/instructores'),
                _navItem(context, 'Programas', Icons.school, '/programas'),
                _navItem(context, 'Ambientes', Icons.meeting_room, '/ambientes'),
                _navItem(context, 'Competencias', Icons.track_changes, '/competencias'),
                _navItem(context, 'Actividades', Icons.assignment_turned_in, '/actividades'),
                _navItem(context, 'Programación', Icons.calendar_month, '/programacion'),
                const Divider(color: Colors.white24, height: 24),
                _navItem(context, 'Reportes', Icons.analytics, '/reportes'),
                if (rol == 'admin') ...[
                  _navItem(context, 'Usuarios', Icons.manage_accounts, '/usuarios'),
                ],
                _navItem(context, 'Mi Perfil', Icons.person, '/perfil'),
              ],
            ),
          ),

          // Logout
          Padding(
            padding: const EdgeInsets.all(12),
            child: ListTile(
              leading: const Icon(Icons.logout, color: Colors.white54),
              title: Text('Cerrar Sesión',
                style: GoogleFonts.dmSans(
                    color: Colors.white54, fontSize: 13)),
              onTap: () => Navigator.pushReplacementNamed(context, '/login'),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _navItem(BuildContext context, String label,
      IconData icon, String ruta) {
    final activo = paginaActual == ruta.replaceAll('/', '');
    return Container(
      margin: const EdgeInsets.only(bottom: 2),
      child: ListTile(
        leading: Icon(icon,
            color: activo ? const Color(0xFF39A900) : Colors.white54,
            size: 20),
        title: Text(label,
          style: GoogleFonts.dmSans(
              color: activo ? Colors.white : Colors.white70,
              fontSize: 13,
              fontWeight: activo ? FontWeight.w600 : FontWeight.w400)),
        tileColor: activo
            ? const Color(0xFF39A900).withOpacity(0.15)
            : Colors.transparent,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8)),
        onTap: () => Navigator.pushReplacementNamed(context, ruta,
            arguments: rol),
        dense: true,
      ),
    );
  }
}