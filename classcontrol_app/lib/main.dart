import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/recuperar_password_screen.dart';
import 'screens/fichas_screen.dart';
import 'screens/instructores_screen.dart';
import 'screens/programas_screen.dart';
import 'screens/competencias_screen.dart';
import 'screens/actividades_screen.dart';
import 'screens/programacion_screen.dart';
import 'screens/reportes_screen.dart';
import 'screens/usuarios_screen.dart';
import 'screens/perfil_screen.dart';
import 'screens/ambientes_screen.dart';
import 'screens/registrar_usuario_screen.dart';
import 'screens/registrar_screen.dart';

void main() {
  runApp(const ClassControlApp());
}

class ClassControlApp extends StatelessWidget {
  const ClassControlApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ClassControl',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF39A900),
        useMaterial3: true,
      ),
      initialRoute: '/login',
      onGenerateRoute: (settings) {
        final rol = settings.arguments as String? ?? 'aprendiz';
        switch (settings.name) {
          case '/login':
            return MaterialPageRoute(
                builder: (_) => const LoginScreen());
          case '/home':
            return MaterialPageRoute(
                builder: (_) => HomeScreen(rol: rol));
          case '/recuperar':
            return MaterialPageRoute(
                builder: (_) => const RecuperarPasswordScreen());
          case '/fichas':
            return MaterialPageRoute(
                builder: (_) => FichasScreen(rol: rol));
          case '/instructores':
            return MaterialPageRoute(
                builder: (_) => InstructoresScreen(rol: rol));
          case '/programas':
            return MaterialPageRoute(
                builder: (_) => ProgramasScreen(rol: rol));
          case '/competencias':
            return MaterialPageRoute(
                builder: (_) => CompetenciasScreen(rol: rol));
          case '/actividades':
            return MaterialPageRoute(
                builder: (_) => ActividadesScreen(rol: rol));
          case '/programacion':
            return MaterialPageRoute(
                builder: (_) => ProgramacionScreen(rol: rol));
          case '/reportes':
            return MaterialPageRoute(
                builder: (_) => ReportesScreen(rol: rol));
          case '/usuarios':
            return MaterialPageRoute(
                builder: (_) => UsuariosScreen(rol: rol));
          case '/perfil':
            return MaterialPageRoute(
                builder: (_) => PerfilScreen(rol: rol));
          case '/ambientes':
            return MaterialPageRoute(
                builder: (_) => AmbientesScreen(rol: rol));
          case '/registrar_usuario':
            return MaterialPageRoute(
                builder: (_) => RegistrarUsuarioScreen(rol: rol));
          case '/registrar':
            return MaterialPageRoute(
               builder: (_) => const RegistrarScreen());
          default:
            return MaterialPageRoute(
                builder: (_) => const LoginScreen());
        }
      },
    );
  }
}