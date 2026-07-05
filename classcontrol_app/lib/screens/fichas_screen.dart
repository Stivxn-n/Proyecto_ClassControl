import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/sidebar.dart';

class FichasScreen extends StatefulWidget {
  final String rol;
  const FichasScreen({super.key, required this.rol});
  @override
  State<FichasScreen> createState() => _FichasScreenState();
}

class _FichasScreenState extends State<FichasScreen> {
  final _busqueda = TextEditingController();
  String _filtroEstado = '';
  int _pagina = 0;
  final int _porPagina = 5;

  final List<Map<String, String>> _fichas = [
    {'codigo': '2550455', 'programa': 'Analisis y Desarrollo de Software', 'nivel': 'Tecnologo', 'instructor': 'Carlos Perez', 'ambiente': '101', 'estado': 'Activa'},
    {'codigo': '2550456', 'programa': 'Multimedia', 'nivel': 'Tecnico', 'instructor': 'Ana Gomez', 'ambiente': '102', 'estado': 'Activa'},
    {'codigo': '2550457', 'programa': 'Gestion Empresarial', 'nivel': 'Tecnologo', 'instructor': 'Luis Torres', 'ambiente': '103', 'estado': 'Inactiva'},
    {'codigo': '2550458', 'programa': 'Electronica', 'nivel': 'Tecnico', 'instructor': 'Maria Lopez', 'ambiente': '104', 'estado': 'Activa'},
    {'codigo': '2550459', 'programa': 'Contabilidad', 'nivel': 'Tecnologo', 'instructor': 'Jose Ramos', 'ambiente': '105', 'estado': 'Activa'},
    {'codigo': '2550460', 'programa': 'Salud Ocupacional', 'nivel': 'Tecnico', 'instructor': 'Sofia Castro', 'ambiente': '106', 'estado': 'Inactiva'},
  ];

  List<Map<String, String>> get _fichasFiltradas {
    return _fichas.where((f) {
      final busq = _busqueda.text.toLowerCase();
      final coincideBusq = busq.isEmpty ||
          f['codigo']!.toLowerCase().contains(busq) ||
          f['programa']!.toLowerCase().contains(busq);
      final coincideEstado =
          _filtroEstado.isEmpty || f['estado'] == _filtroEstado;
      return coincideBusq && coincideEstado;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final fichas = _fichasFiltradas;
    final totalPaginas = (fichas.length / _porPagina).ceil();
    final fichasPagina = fichas
        .skip(_pagina * _porPagina)
        .take(_porPagina)
        .toList();

    return Scaffold(
      body: Row(
        children: [
          Sidebar(rol: widget.rol, paginaActual: 'fichas'),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Gestion de Fichas',
                              style: GoogleFonts.dmSans(
                                  fontSize: 24, fontWeight: FontWeight.w700)),
                          Text('Administra las fichas de formacion activas.',
                              style: GoogleFonts.dmSans(
                                  fontSize: 14, color: Colors.grey[500])),
                        ],
                      ),
                      if (widget.rol == 'admin')
                        ElevatedButton.icon(
                          onPressed: () => _mostrarModal(context),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: Text('Nueva Ficha',
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

                  // Filtros
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10)
                      ],
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _busqueda,
                            onChanged: (_) => setState(() => _pagina = 0),
                            decoration: InputDecoration(
                              prefixIcon: const Icon(Icons.search),
                              hintText: 'Buscar por codigo o programa...',
                              border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10)),
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 12),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        DropdownButton<String>(
                          value: _filtroEstado.isEmpty ? null : _filtroEstado,
                          hint: Text('Estado',
                              style: GoogleFonts.dmSans(fontSize: 13)),
                          items: ['Activa', 'Inactiva']
                              .map((e) => DropdownMenuItem(
                                  value: e,
                                  child: Text(e,
                                      style: GoogleFonts.dmSans(fontSize: 13))))
                              .toList(),
                          onChanged: (v) =>
                              setState(() {
                                _filtroEstado = v ?? '';
                                _pagina = 0;
                              }),
                        ),
                        if (_filtroEstado.isNotEmpty)
                          TextButton(
                            onPressed: () =>
                                setState(() => _filtroEstado = ''),
                            child: Text('Limpiar',
                                style: GoogleFonts.dmSans(fontSize: 13)),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Tabla
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10)
                      ],
                    ),
                    child: Column(
                      children: [
                        // Encabezado tabla
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 14),
                          decoration: const BoxDecoration(
                            color: Color(0xFFF8F9FA),
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(12),
                              topRight: Radius.circular(12),
                            ),
                          ),
                          child: Row(
                            children: [
                              _th('Codigo', 1),
                              _th('Programa', 3),
                              _th('Nivel', 1),
                              _th('Instructor', 2),
                              _th('Ambiente', 1),
                              _th('Estado', 1),
                              if (widget.rol == 'admin') _th('Acciones', 1),
                            ],
                          ),
                        ),
                        // Filas
                        ...fichasPagina.map((f) => _fila(context, f)),
                        // Paginacion
                        if (totalPaginas > 1)
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Mostrando ${_pagina * _porPagina + 1}-${(_pagina * _porPagina + fichasPagina.length)} de ${fichas.length}',
                                  style: GoogleFonts.dmSans(
                                      fontSize: 13, color: Colors.grey[500]),
                                ),
                                Row(
                                  children: List.generate(
                                    totalPaginas,
                                    (i) => Padding(
                                      padding: const EdgeInsets.only(left: 4),
                                      child: TextButton(
                                        onPressed: () =>
                                            setState(() => _pagina = i),
                                        style: TextButton.styleFrom(
                                          backgroundColor: _pagina == i
                                              ? const Color(0xFF39A900)
                                              : null,
                                          minimumSize: const Size(36, 36),
                                        ),
                                        child: Text('${i + 1}',
                                            style: GoogleFonts.dmSans(
                                                color: _pagina == i
                                                    ? Colors.white
                                                    : null)),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
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
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600])),
    );
  }

  Widget _fila(BuildContext context, Map<String, String> f) {
    final activa = f['estado'] == 'Activa';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFFEEEEEE)))),
      child: Row(
        children: [
          Expanded(
              flex: 1,
              child: Text(f['codigo']!,
                  style: GoogleFonts.dmSans(
                      fontSize: 13, fontWeight: FontWeight.w600))),
          Expanded(
              flex: 3,
              child: Text(f['programa']!,
                  style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(
              flex: 1,
              child:
                  Text(f['nivel']!, style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(
              flex: 2,
              child: Text(f['instructor']!,
                  style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(
              flex: 1,
              child: Text(f['ambiente']!,
                  style: GoogleFonts.dmSans(fontSize: 13))),
          Expanded(
            flex: 1,
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: activa
                    ? const Color(0xFF39A900).withOpacity(0.1)
                    : Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(f['estado']!,
                  style: GoogleFonts.dmSans(
                      fontSize: 12,
                      color: activa
                          ? const Color(0xFF39A900)
                          : Colors.red,
                      fontWeight: FontWeight.w600)),
            ),
          ),
          if (widget.rol == 'admin')
            Expanded(
              flex: 1,
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.edit_outlined,
                        size: 18, color: Colors.blue),
                    onPressed: () => _mostrarModal(context, ficha: f),
                    tooltip: 'Editar',
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline,
                        size: 18, color: Colors.red),
                    onPressed: () => _confirmarEliminar(context, f),
                    tooltip: 'Eliminar',
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  void _mostrarModal(BuildContext context,
      {Map<String, String>? ficha}) {
    final codigoCtrl =
        TextEditingController(text: ficha?['codigo'] ?? '');
    final programaCtrl =
        TextEditingController(text: ficha?['programa'] ?? '');
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(ficha == null ? 'Nueva Ficha' : 'Editar Ficha',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: codigoCtrl,
              decoration: InputDecoration(
                labelText: 'Codigo',
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: programaCtrl,
              decoration: InputDecoration(
                labelText: 'Programa',
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() {
                if (ficha == null) {
                  _fichas.add({
                    'codigo': codigoCtrl.text,
                    'programa': programaCtrl.text,
                    'nivel': 'Tecnologo',
                    'instructor': '',
                    'ambiente': '',
                    'estado': 'Activa',
                  });
                } else {
                  ficha['codigo'] = codigoCtrl.text;
                  ficha['programa'] = programaCtrl.text;
                }
              });
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF39A900)),
            child: Text('Guardar',
                style: GoogleFonts.dmSans(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _confirmarEliminar(
      BuildContext context, Map<String, String> ficha) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Eliminar Ficha',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
        content: Text('Esta accion no se puede deshacer.',
            style: GoogleFonts.dmSans()),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Cancelar', style: GoogleFonts.dmSans())),
          ElevatedButton(
            onPressed: () {
              setState(() => _fichas.remove(ficha));
              Navigator.pop(context);
            },
            style:
                ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('Eliminar',
                style: GoogleFonts.dmSans(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}