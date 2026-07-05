import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class PerfilScreen extends StatefulWidget {
  final String rol;
  const PerfilScreen({super.key, required this.rol});
  @override
  State<PerfilScreen> createState() => _PerfilScreenState();
}

class _PerfilScreenState extends State<PerfilScreen> {
  final _nombreCtrl = TextEditingController(text: 'Coordinacion Academica');
  final _emailCtrl = TextEditingController(text: 'admin@sena.edu.co');
  final _telefonoCtrl = TextEditingController(text: '3001234567');
  bool _editando = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'perfil'),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Mi Perfil',
                      style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                  Text('Administra tu informacion personal.',
                      style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 32),
                  Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                    ),
                    child: Column(
                      children: [
                        // Avatar
                        Stack(
                          children: [
                            CircleAvatar(
                              radius: 50,
                              backgroundColor: const Color(0xFF39A900).withOpacity(0.15),
                              child: Text(
                                _nombreCtrl.text.isNotEmpty ? _nombreCtrl.text[0] : 'U',
                                style: GoogleFonts.dmSans(
                                    fontSize: 36,
                                    color: const Color(0xFF39A900),
                                    fontWeight: FontWeight.w700),
                              ),
                            ),
                            Positioned(
                              bottom: 0, right: 0,
                              child: Container(
                                width: 32, height: 32,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF39A900),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: const Icon(Icons.camera_alt, color: Colors.white, size: 16),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(_nombreCtrl.text,
                            style: GoogleFonts.dmSans(fontSize: 20, fontWeight: FontWeight.w700)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF39A900).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(widget.rol.toUpperCase(),
                              style: GoogleFonts.dmSans(
                                  fontSize: 12,
                                  color: const Color(0xFF39A900),
                                  fontWeight: FontWeight.w600)),
                        ),
                        const SizedBox(height: 32),
                        // Campos
                        _campo('Nombre completo', _nombreCtrl, Icons.person_outline),
                        const SizedBox(height: 16),
                        _campo('Correo electronico', _emailCtrl, Icons.mail_outline),
                        const SizedBox(height: 16),
                        _campo('Telefono', _telefonoCtrl, Icons.phone_outlined),
                        const SizedBox(height: 24),
                        // Botones
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (_editando)
                              TextButton(
                                onPressed: () => setState(() => _editando = false),
                                child: Text('Cancelar', style: GoogleFonts.dmSans()),
                              ),
                            const SizedBox(width: 12),
                            ElevatedButton.icon(
                              onPressed: () {
                                if (_editando) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Perfil actualizado correctamente',
                                          style: GoogleFonts.dmSans()),
                                      backgroundColor: const Color(0xFF39A900),
                                    ),
                                  );
                                }
                                setState(() => _editando = !_editando);
                              },
                              icon: Icon(_editando ? Icons.save : Icons.edit, color: Colors.white),
                              label: Text(_editando ? 'Guardar cambios' : 'Editar perfil',
                                  style: GoogleFonts.dmSans(color: Colors.white)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF39A900),
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        const Divider(),
                        const SizedBox(height: 16),
                        // Cambiar contrasena
                        ListTile(
                          leading: const Icon(Icons.lock_outline, color: Color(0xFF39A900)),
                          title: Text('Cambiar contrasena',
                              style: GoogleFonts.dmSans(fontWeight: FontWeight.w600)),
                          subtitle: Text('Actualiza tu contrasena de acceso',
                              style: GoogleFonts.dmSans(fontSize: 12, color: Colors.grey)),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () => Navigator.pushNamed(context, '/recuperar'),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        ListTile(
                          leading: const Icon(Icons.logout, color: Colors.red),
                          title: Text('Cerrar sesion',
                              style: GoogleFonts.dmSans(fontWeight: FontWeight.w600, color: Colors.red)),
                          subtitle: Text('Salir de la aplicacion',
                              style: GoogleFonts.dmSans(fontSize: 12, color: Colors.grey)),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () => Navigator.pushReplacementNamed(context, '/login'),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
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

  Widget _campo(String label, TextEditingController ctrl, IconData icono) {
    return TextFormField(
      controller: ctrl,
      enabled: _editando,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icono),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFEEEEEE)),
        ),
      ),
    );
  }
}