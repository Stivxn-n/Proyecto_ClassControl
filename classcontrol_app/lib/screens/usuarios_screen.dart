import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class UsuariosScreen extends StatefulWidget {
  final String rol;
  const UsuariosScreen({super.key, required this.rol});
  @override
  State<UsuariosScreen> createState() => _UsuariosScreenState();
}

class _UsuariosScreenState extends State<UsuariosScreen> {
  final _busqueda = TextEditingController();

  final List<Map<String, String>> _usuarios = [
    {'nombre': 'Admin Principal', 'email': 'admin@sena.edu.co', 'rol': 'admin', 'estado': 'Activo'},
    {'nombre': 'Carlos Perez', 'email': 'instructor@sena.edu.co', 'rol': 'instructor', 'estado': 'Activo'},
    {'nombre': 'Ana Gomez', 'email': 'agomez@sena.edu.co', 'rol': 'instructor', 'estado': 'Activo'},
    {'nombre': 'Juan Aprendiz', 'email': 'aprendiz@sena.edu.co', 'rol': 'aprendiz', 'estado': 'Activo'},
    {'nombre': 'Maria Lopez', 'email': 'mlopez@sena.edu.co', 'rol': 'aprendiz', 'estado': 'Inactivo'},
  ];

  List<Map<String, String>> get _filtrados {
    final busq = _busqueda.text.toLowerCase();
    return _usuarios.where((u) =>
        busq.isEmpty ||
        u['nombre']!.toLowerCase().contains(busq) ||
        u['email']!.toLowerCase().contains(busq)).toList();
  }

  Color _colorRol(String rol) {
    switch (rol) {
      case 'admin': return Colors.red;
      case 'instructor': return Colors.blue;
      case 'aprendiz': return const Color(0xFF39A900);
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.rol != 'admin') {
      return Scaffold(
        body: Row(
          children: [
            Sidebar(rol: widget.rol, paginaActual: 'usuarios'),
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.lock, size: 64, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text('Acceso restringido',
                        style: GoogleFonts.dmSans(fontSize: 20, fontWeight: FontWeight.w700)),
                    Text('Solo los administradores pueden ver esta seccion.',
                        style: GoogleFonts.dmSans(color: Colors.grey)),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    }

    final lista = _filtrados;
    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'usuarios'),
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
                          Text('Gestion de Usuarios',
                              style: GoogleFonts.dmSans(fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Administra los usuarios del sistema.',
                              style: GoogleFonts.dmSans(fontSize: 14, color: Colors.grey)),
                        ],
                      ),
                      ElevatedButton.icon(
                        onPressed: () => _mostrarModal(context),
                        icon: const Icon(Icons.add, color: Colors.white),
                        label: Text('Nuevo Usuario', style: GoogleFonts.dmSans(color: Colors.white)),
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
                      hintText: 'Buscar usuario...',
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
                              _th('Nombre', 2),
                              _th('Email', 3),
                              _th('Rol', 1),
                              _th('Estado', 1),
                              _th('Acciones', 1),
                            ],
                          ),
                        ),
                        ...lista.map((u) => _fila(context, u)),
                        if (lista.isEmpty)
                          Padding(
                            padding: const EdgeInsets.all(32),
                            child: Center(child: Text('No se encontraron usuarios.',
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

  Widget _fila(BuildContext context, Map<String, String> u) {
    final activo = u['estado'] == 'Activo';
    final colorRol = _colorRol(u['rol']!);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFFEEEEEE)))),
      child: Row(
        children: [
          Expanded(flex: 2, child: Row(children: [
            CircleAvatar(
              backgroundColor: colorRol.withOpacity(0.15),
              radius: 18,
              child: Text(u['nombre']![0],
                  style: GoogleFonts.dmSans(color: colorRol, fontWeight: FontWeight.w600)),
            ),
            const SizedBox(width: 10),
            Text(u['nombre']!, style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600)),
          ])),
          Expanded(flex: 3, child: Text(u['email']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(flex: 1, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: colorRol.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(u['rol']!,
                style: GoogleFonts.dmSans(fontSize: 12, color: colorRol, fontWeight: FontWeight.w600)),
          )),
          Expanded(flex: 1, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: activo ? const Color(0xFF39A900).withOpacity(0.1) : Colors.red.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(u['estado']!,
                style: GoogleFonts.dmSans(fontSize: 12,
                    color: activo ? const Color(0xFF39A900) : Colors.red,
                    fontWeight: FontWeight.w600)),
          )),
          Expanded(flex: 1, child: Row(children: [
            IconButton(icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blue),
                onPressed: () => _mostrarModal(context, usuario: u)),
            IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                onPressed: () => _confirmarEliminar(context, u)),
          ])),
        ],
      ),
    );
  }

  void _mostrarModal(BuildContext context, {Map<String, String>? usuario}) {
    final nombreCtrl = TextEditingController(text: usuario?['nombre'] ?? '');
    final emailCtrl = TextEditingController(text: usuario?['email'] ?? '');
    String rol = usuario?['rol'] ?? 'aprendiz';
    showDialog(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (context, setModalState) => AlertDialog(
          title: Text(usuario == null ? 'Nuevo Usuario' : 'Editar Usuario',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
          content: SizedBox(
            width: 400,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: nombreCtrl,
                    decoration: InputDecoration(labelText: 'Nombre',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
                const SizedBox(height: 12),
                TextField(controller: emailCtrl,
                    decoration: InputDecoration(labelText: 'Email',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: rol,
                  decoration: InputDecoration(labelText: 'Rol',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))),
                  items: ['admin', 'instructor', 'aprendiz']
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
                  onChanged: (v) => setModalState(() => rol = v!),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context),
                child: Text('Cancelar', style: GoogleFonts.dmSans())),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  if (usuario == null) {
                    _usuarios.add({'nombre': nombreCtrl.text,
                        'email': emailCtrl.text, 'rol': rol, 'estado': 'Activo'});
                  } else {
                    usuario['nombre'] = nombreCtrl.text;
                    usuario['email'] = emailCtrl.text;
                    usuario['rol'] = rol;
                  }
                });
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF39A900)),
              child: Text('Guardar', style: GoogleFonts.dmSans(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmarEliminar(BuildContext context, Map<String, String> usuario) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Usuario', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.', style: GoogleFonts.dmSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _usuarios.remove(usuario));
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