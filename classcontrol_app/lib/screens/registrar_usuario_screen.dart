import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RegistrarUsuarioScreen extends StatefulWidget {
  final String rol;
  const RegistrarUsuarioScreen({super.key, required this.rol});
  @override
  State<RegistrarUsuarioScreen> createState() => _RegistrarUsuarioScreenState();
}

class _RegistrarUsuarioScreenState extends State<RegistrarUsuarioScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nombresCtrl = TextEditingController();
  final _apellidosCtrl = TextEditingController();
  final _documentoCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _usernameCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  String _tipoDoc = '';
  String _nivelEducativo = '';
  String _rol = '';
  bool _verPass = false;
  bool _verConfirm = false;
  bool _cargando = false;

  void _registrar() async {
    if (!_formKey.currentState!.validate()) return;
    if (_passCtrl.text != _confirmCtrl.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Las contrasenas no coinciden',
            style: GoogleFonts.dmSans()), backgroundColor: Colors.red),
      );
      return;
    }
    setState(() => _cargando = true);
    await Future.delayed(const Duration(seconds: 2));
    setState(() => _cargando = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Usuario creado correctamente',
            style: GoogleFonts.dmSans()), backgroundColor: const Color(0xFF39A900)),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A1A2E),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(children: [
          Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              color: const Color(0xFF39A900),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.school, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 10),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('ClassControl', style: GoogleFonts.dmSans(
                color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700)),
            Text('Gestion Academica SENA', style: GoogleFonts.dmSans(
                color: Colors.white54, fontSize: 10)),
          ]),
          const Spacer(),
          // Indicador de quién está registrando (solo informativo)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.08),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text('Creando desde: ${widget.rol.toUpperCase()}',
                style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 11)),
          ),
        ]),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Sidebar izquierdo
              Container(
                width: 220,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A2E),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.person_add, color: Color(0xFF39A900), size: 40),
                    const SizedBox(height: 16),
                    Text('Registro de Usuarios',
                        style: GoogleFonts.dmSans(color: Colors.white,
                            fontSize: 16, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Text('Ingrese los datos para dar de alta un nuevo integrante.',
                        style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 12)),
                    const SizedBox(height: 32),
                    _paso(Icons.info_outline, 'Datos Personales', 'Informacion basica y contacto', true),
                    const SizedBox(height: 16),
                    _paso(Icons.lock_outline, 'Seguridad', 'Credenciales de acceso', false),
                    const SizedBox(height: 16),
                    _paso(Icons.badge_outlined, 'Roles', 'Permisos en el sistema', false),
                    const SizedBox(height: 32),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: Text(
                        '"La formacion profesional integral es el proceso educativo teorico-practico de caracter integral."',
                        style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 11,
                            fontStyle: FontStyle.italic),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              // Formulario
              Flexible(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 600),
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08),
                        blurRadius: 24, offset: const Offset(0, 8))],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Datos personales
                        _seccion(Icons.person_outline, 'Datos Personales'),
                        const SizedBox(height: 16),
                        Row(children: [
                          Expanded(child: _campo('Nombres', _nombresCtrl,
                              validator: (v) => v!.length < 2 ? 'Minimo 2 caracteres' : null)),
                          const SizedBox(width: 12),
                          Expanded(child: _campo('Apellidos', _apellidosCtrl,
                              validator: (v) => v!.length < 2 ? 'Minimo 2 caracteres' : null)),
                        ]),
                        const SizedBox(height: 12),
                        Row(children: [
                          Expanded(child: _dropdown('Tipo de Documento', _tipoDoc,
                            ['Cedula de Ciudadania', 'Tarjeta de Identidad', 'Cedula de Extranjeria', 'Pasaporte'],
                            (v) => setState(() => _tipoDoc = v!))),
                          const SizedBox(width: 12),
                          Expanded(child: _campo('Numero de Identificacion', _documentoCtrl,
                              tipo: TextInputType.number,
                              validator: (v) => v!.length < 6 ? 'Entre 6 y 12 digitos' : null)),
                        ]),
                        const SizedBox(height: 12),
                        Row(children: [
                          Expanded(child: _dropdown('Nivel Educativo', _nivelEducativo,
                            ['Primaria', 'Bachillerato', 'Tecnico', 'Tecnologo', 'Universitario', 'Especializacion', 'Maestria', 'Doctorado'],
                            (v) => setState(() => _nivelEducativo = v!))),
                          const SizedBox(width: 12),
                          Expanded(child: _campo('Profesion', _nombresCtrl)),
                        ]),
                        const SizedBox(height: 24),

                        // Contacto
                        _seccion(Icons.mail_outline, 'Contacto'),
                        const SizedBox(height: 16),
                        _campo('Correo Electronico', _emailCtrl,
                            tipo: TextInputType.emailAddress,
                            validator: (v) => !v!.contains('@') ? 'Correo invalido' : null),
                        const SizedBox(height: 12),
                        Row(children: [
                          Expanded(child: _campo('Telefono', _telefonoCtrl,
                              tipo: TextInputType.phone,
                              validator: (v) => v!.length < 7 ? 'Telefono invalido' : null)),
                          const SizedBox(width: 12),
                          Expanded(child: _dropdown('Rol del Usuario', _rol,
                            ['instructor', 'aprendiz', 'admin'],
                            (v) => setState(() => _rol = v!),
                            requerido: true)),
                        ]),
                        const SizedBox(height: 24),

                        // Credenciales
                        _seccion(Icons.lock_outline, 'Credenciales de Acceso'),
                        const SizedBox(height: 16),
                        _campo('Nombre de Usuario', _usernameCtrl,
                            validator: (v) => v!.length < 4 ? 'Minimo 4 caracteres' : null),
                        const SizedBox(height: 12),
                        Row(children: [
                          Expanded(child: _campoPass('Contrasena', _passCtrl, _verPass,
                              () => setState(() => _verPass = !_verPass))),
                          const SizedBox(width: 12),
                          Expanded(child: _campoPass('Confirmar Contrasena', _confirmCtrl,
                              _verConfirm, () => setState(() => _verConfirm = !_verConfirm))),
                        ]),
                        const SizedBox(height: 32),

                        // Botones
                        Row(children: [
                          Expanded(
                            child: SizedBox(
                              height: 48,
                              child: ElevatedButton.icon(
                                onPressed: _cargando ? null : _registrar,
                                icon: _cargando
                                    ? const SizedBox(width: 18, height: 18,
                                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                    : const Icon(Icons.person_add, color: Colors.white),
                                label: Text(_cargando ? 'Creando...' : 'Crear Usuario',
                                    style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.w600)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF39A900),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          SizedBox(
                            height: 48,
                            child: OutlinedButton(
                              onPressed: () => Navigator.pop(context),
                              style: OutlinedButton.styleFrom(
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              child: Text('Cancelar', style: GoogleFonts.dmSans()),
                            ),
                          ),
                        ]),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _paso(IconData icono, String titulo, String sub, bool activo) {
    return Row(children: [
      Container(
        width: 36, height: 36,
        decoration: BoxDecoration(
          color: activo ? const Color(0xFF39A900) : Colors.white24,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Icon(icono, color: Colors.white, size: 18),
      ),
      const SizedBox(width: 10),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(titulo, style: GoogleFonts.dmSans(color: Colors.white,
            fontSize: 12, fontWeight: FontWeight.w600)),
        Text(sub, style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 10)),
      ]),
    ]);
  }

  Widget _seccion(IconData icono, String titulo) {
    return Row(children: [
      Icon(icono, color: const Color(0xFF39A900), size: 18),
      const SizedBox(width: 8),
      Text(titulo, style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w700)),
      const SizedBox(width: 8),
      const Expanded(child: Divider()),
    ]);
  }

  Widget _campo(String label, TextEditingController ctrl,
      {TextInputType tipo = TextInputType.text, String? Function(String?)? validator}) {
    return TextFormField(
      controller: ctrl,
      keyboardType: tipo,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      ),
      validator: validator,
    );
  }

  Widget _campoPass(String label, TextEditingController ctrl, bool ver, VoidCallback toggle) {
    return TextFormField(
      controller: ctrl,
      obscureText: !ver,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        suffixIcon: IconButton(
          icon: Icon(ver ? Icons.visibility_off_outlined : Icons.visibility_outlined),
          onPressed: toggle,
        ),
      ),
      validator: (v) => v!.length < 8 ? 'Minimo 8 caracteres' : null,
    );
  }

  Widget _dropdown(String label, String valor, List<String> opciones,
      void Function(String?) onChange, {bool requerido = false}) {
    return DropdownButtonFormField<String>(
      value: valor.isEmpty ? null : valor,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      ),
      items: opciones.map((e) => DropdownMenuItem(value: e, child: Text(e,
          style: GoogleFonts.dmSans(fontSize: 13)))).toList(),
      onChanged: onChange,
      validator: requerido ? (v) => v == null ? 'Seleccione una opcion' : null : null,
    );
  }
}