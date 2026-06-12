-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ClassControl
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ClassControl
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ClassControl` DEFAULT CHARACTER SET utf8mb4 ;
USE `ClassControl` ;

-- -----------------------------------------------------
-- Table `ClassControl`.`Tipo_Documento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Tipo_Documento` (
  `id_tipo_Documento` INT NOT NULL AUTO_INCREMENT,
  `descripcion_TipoDoc` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo_Documento`),
  UNIQUE INDEX `descripcion_TipoDoc_UNIQUE` (`descripcion_TipoDoc` ) );


-- -----------------------------------------------------
-- Table `ClassControl`.`Roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Roles` (
  `id_roles` INT NOT NULL AUTO_INCREMENT,
  `descripcion_Roles` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_roles`),
  UNIQUE INDEX `descripcion_Roles_UNIQUE` (`descripcion_Roles` ) );


-- -----------------------------------------------------
-- Table `ClassControl`.`Tipo_vinculacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Tipo_vinculacion` (
  `id_tipo_vinculacion` INT NOT NULL AUTO_INCREMENT,
  `descripcion_vinculacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo_vinculacion`),
  UNIQUE INDEX `descripcion_vinculacion_UNIQUE` (`descripcion_vinculacion` ) );


-- -----------------------------------------------------
-- Table `ClassControl`.`Usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Usuarios` (
  `id_usuarios` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `identificacion` VARCHAR(45) NOT NULL,
  `fecha_Nacimiento` DATE NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `nivel_Educativo` VARCHAR(45) NOT NULL,
  `profesion` VARCHAR(45) NOT NULL,
  `clave` VARCHAR(255) NOT NULL,
  `fecha_Creacion` DATE NOT NULL,
  `activo` TINYINT(1) NOT NULL,
  `fecha_ExpiracionContraseña` DATE NOT NULL,
  `Roles_id_roles` INT NOT NULL,
  `Tipo_Documento_id_tipo_Documento` INT NOT NULL,
  `Tipo_vinculacion_id_tipo_vinculacion` INT NOT NULL,
  PRIMARY KEY (`id_usuarios`),
  INDEX `fk_Usuarios_Roles_idx` (`Roles_id_roles` ) ,
  INDEX `fk_Usuarios_Tipo_Documento1_idx` (`Tipo_Documento_id_tipo_Documento` ) ,
  INDEX `fk_Usuarios_Tipo_vinculacion1_idx` (`Tipo_vinculacion_id_tipo_vinculacion` ) ,
  UNIQUE INDEX `identificacion_UNIQUE` (`identificacion` ) ,
  UNIQUE INDEX `correo_UNIQUE` (`correo` ) ,
  UNIQUE INDEX `username_UNIQUE` (`username` ) ,
  CONSTRAINT `fk_Usuarios_Roles`
    FOREIGN KEY (`Roles_id_roles`)
    REFERENCES `ClassControl`.`Roles` (`id_roles`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Usuarios_Tipo_Documento1`
    FOREIGN KEY (`Tipo_Documento_id_tipo_Documento`)
    REFERENCES `ClassControl`.`Tipo_Documento` (`id_tipo_Documento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Usuarios_Tipo_vinculacion1`
    FOREIGN KEY (`Tipo_vinculacion_id_tipo_vinculacion`)
    REFERENCES `ClassControl`.`Tipo_vinculacion` (`id_tipo_vinculacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `ClassControl`.`Programas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Programas` (
  `idProgramas` INT NOT NULL AUTO_INCREMENT,
  `codigo_programa` INT NOT NULL,
  `nombre_programa` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idProgramas`),
  UNIQUE INDEX `codigo_programa_UNIQUE` (`codigo_programa` ) );


-- -----------------------------------------------------
-- Table `ClassControl`.`Jornada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Jornada` (
  `id_jornada` INT NOT NULL AUTO_INCREMENT,
  `descripcion_Jornada` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_jornada`));


-- -----------------------------------------------------
-- Table `ClassControl`.`Modalidad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Modalidad` (
  `id_modalidad` INT NOT NULL AUTO_INCREMENT,
  `descripcion_Modalidad` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_modalidad`));


-- -----------------------------------------------------
-- Table `ClassControl`.`Nivel_formacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Nivel_formacion` (
  `id_nivel_formacion` INT NOT NULL AUTO_INCREMENT,
  `descripcion_Nivel_Formacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_nivel_formacion`));


-- -----------------------------------------------------
-- Table `ClassControl`.`Sede`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Sede` (
  `id_sede` INT NOT NULL AUTO_INCREMENT,
  `nombre_sede` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_sede`),
  UNIQUE INDEX `nombre_sede_UNIQUE` (`nombre_sede` ) );


-- -----------------------------------------------------
-- Table `ClassControl`.`Tipo_Estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Tipo_Estado` (
  `id_tipo_estado` INT NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo_estado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ClassControl`.`Estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Estado` (
  `id_estado` INT NOT NULL AUTO_INCREMENT,
  `descripcion_Estado` VARCHAR(45) NOT NULL,
  `Tipo_Estado_id_tipo_estado` INT NOT NULL,
  PRIMARY KEY (`id_estado`),
  INDEX `fk_Estado_Tipo_Estado1_idx` (`Tipo_Estado_id_tipo_estado` ) ,
  CONSTRAINT `fk_Estado_Tipo_Estado1`
    FOREIGN KEY (`Tipo_Estado_id_tipo_estado`)
    REFERENCES `ClassControl`.`Tipo_Estado` (`id_tipo_estado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `ClassControl`.`Etapa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Etapa` (
  `id_etapa` INT NOT NULL AUTO_INCREMENT,
  `descripcion_Etapa` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_etapa`),
  UNIQUE INDEX `descripcion_Etapa_UNIQUE` (`descripcion_Etapa` ) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ClassControl`.`Ficha`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Ficha` (
  `id_ficha` INT NOT NULL AUTO_INCREMENT,
  `codigo_ficha` VARCHAR(45) NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `cantidad_aprendices` INT NOT NULL,
  `Programas_idProgramas` INT NOT NULL,
  `Jornada_id_jornada` INT NOT NULL,
  `Modalidad_id_modalidad` INT NOT NULL,
  `Nivel_formacion_id_nivel_formacion` INT NOT NULL,
  `Sede_id_sede` INT NOT NULL,
  `Estado_id_estado` INT NOT NULL,
  `Etapa_id_etapa` INT NOT NULL,
  PRIMARY KEY (`id_ficha`),
  INDEX `fk_Ficha_Programas1_idx` (`Programas_idProgramas` ) ,
  INDEX `fk_Ficha_Jornada1_idx` (`Jornada_id_jornada` ) ,
  INDEX `fk_Ficha_Modalidad1_idx` (`Modalidad_id_modalidad` ) ,
  INDEX `fk_Ficha_Nivel_formacion1_idx` (`Nivel_formacion_id_nivel_formacion` ) ,
  INDEX `fk_Ficha_Sede1_idx` (`Sede_id_sede` ) ,
  INDEX `fk_Ficha_Estado1_idx` (`Estado_id_estado` ) ,
  INDEX `fk_Ficha_Etapa1_idx` (`Etapa_id_etapa` ) ,
  CONSTRAINT `fk_Ficha_Programas1`
    FOREIGN KEY (`Programas_idProgramas`)
    REFERENCES `ClassControl`.`Programas` (`idProgramas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ficha_Jornada1`
    FOREIGN KEY (`Jornada_id_jornada`)
    REFERENCES `ClassControl`.`Jornada` (`id_jornada`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ficha_Modalidad1`
    FOREIGN KEY (`Modalidad_id_modalidad`)
    REFERENCES `ClassControl`.`Modalidad` (`id_modalidad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ficha_Nivel_formacion1`
    FOREIGN KEY (`Nivel_formacion_id_nivel_formacion`)
    REFERENCES `ClassControl`.`Nivel_formacion` (`id_nivel_formacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ficha_Sede1`
    FOREIGN KEY (`Sede_id_sede`)
    REFERENCES `ClassControl`.`Sede` (`id_sede`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ficha_Estado1`
    FOREIGN KEY (`Estado_id_estado`)
    REFERENCES `ClassControl`.`Estado` (`id_estado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Ficha_Etapa1`
    FOREIGN KEY (`Etapa_id_etapa`)
    REFERENCES `ClassControl`.`Etapa` (`id_etapa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `ClassControl`.`Ambientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Ambientes` (
  `id_ambientes` INT NOT NULL AUTO_INCREMENT,
  `descripcion_Ambiente` VARCHAR(45) NOT NULL,
  `capacidad` INT NOT NULL,
  `Sede_id_sede` INT NOT NULL,
  PRIMARY KEY (`id_ambientes`),
  INDEX `fk_Ambientes_Sede1_idx` (`Sede_id_sede` ) ,
  UNIQUE INDEX `descripcion_Ambiente_UNIQUE` (`descripcion_Ambiente` ) ,
  CONSTRAINT `fk_Ambientes_Sede1`
    FOREIGN KEY (`Sede_id_sede`)
    REFERENCES `ClassControl`.`Sede` (`id_sede`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ClassControl`.`Trimestre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Trimestre` (
  `id_trimestre` INT NOT NULL AUTO_INCREMENT,
  `num_trimestre` INT NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  PRIMARY KEY (`id_trimestre`));


-- -----------------------------------------------------
-- Table `ClassControl`.`Programacion_Instructores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Programacion_Instructores` (
  `id_programacion_Instructores` INT NOT NULL AUTO_INCREMENT,
  `Observaciones` VARCHAR(45) NOT NULL,
  `fecha_inicial_Prog` DATE NOT NULL,
  `fecha_fin_Prog` DATE NOT NULL,
  `diasSemana` ENUM('LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB') NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `Ficha_id_ficha` INT NOT NULL,
  `Usuarios_id_usuarios` INT NOT NULL,
  `Ambientes_id_ambientes` INT NOT NULL,
  `Trimestre_id_trimestre` INT NOT NULL,
  `Estado_id_estado` INT NOT NULL,
  PRIMARY KEY (`id_programacion_Instructores`),
  INDEX `fk_Programacion_Instructores_Ficha1_idx` (`Ficha_id_ficha` ) ,
  INDEX `fk_Programacion_Instructores_Usuarios1_idx` (`Usuarios_id_usuarios` ) ,
  INDEX `fk_Programacion_Instructores_Ambientes1_idx` (`Ambientes_id_ambientes` ) ,
  INDEX `fk_Programacion_Instructores_Trimestre1_idx` (`Trimestre_id_trimestre` ) ,
  INDEX `fk_Programacion_Instructores_Estado1_idx` (`Estado_id_estado` ) ,
  UNIQUE INDEX `fecha_inicial_Prog_UNIQUE` (`fecha_inicial_Prog` ) ,
  UNIQUE INDEX `fecha_fin_Prog_UNIQUE` (`fecha_fin_Prog` ) ,
  UNIQUE INDEX `diasSemana_UNIQUE` (`diasSemana` ) ,
  UNIQUE INDEX `Ambientes_id_ambientes_UNIQUE` (`Ambientes_id_ambientes` ) ,
  UNIQUE INDEX `id_programacion_Instructores_UNIQUE` (`id_programacion_Instructores` ) ,
  UNIQUE INDEX `hora_inicio_UNIQUE` (`hora_inicio` ) ,
  UNIQUE INDEX `hora_fin_UNIQUE` (`hora_fin` ) ,
  CONSTRAINT `fk_Programacion_Instructores_Ficha1`
    FOREIGN KEY (`Ficha_id_ficha`)
    REFERENCES `ClassControl`.`Ficha` (`id_ficha`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Programacion_Instructores_Usuarios1`
    FOREIGN KEY (`Usuarios_id_usuarios`)
    REFERENCES `ClassControl`.`Usuarios` (`id_usuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Programacion_Instructores_Ambientes1`
    FOREIGN KEY (`Ambientes_id_ambientes`)
    REFERENCES `ClassControl`.`Ambientes` (`id_ambientes`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Programacion_Instructores_Trimestre1`
    FOREIGN KEY (`Trimestre_id_trimestre`)
    REFERENCES `ClassControl`.`Trimestre` (`id_trimestre`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Programacion_Instructores_Estado1`
    FOREIGN KEY (`Estado_id_estado`)
    REFERENCES `ClassControl`.`Estado` (`id_estado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ClassControl`.`Competencias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Competencias` (
  `id_competencias` INT NOT NULL AUTO_INCREMENT,
  `codigoCompetencias` INT NOT NULL,
  `descripcionCompetencias` VARCHAR(45) NOT NULL,
  `Programacion_Instructores_id_programacion_Instructores` INT NOT NULL,
  PRIMARY KEY (`id_competencias`),
  UNIQUE INDEX `codigoCompetencias_UNIQUE` (`codigoCompetencias` ) ,
  INDEX `fk_Competencias_Programacion_Instructores1_idx` (`Programacion_Instructores_id_programacion_Instructores` ) ,
  CONSTRAINT `fk_Competencias_Programacion_Instructores1`
    FOREIGN KEY (`Programacion_Instructores_id_programacion_Instructores`)
    REFERENCES `ClassControl`.`Programacion_Instructores` (`id_programacion_Instructores`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ClassControl`.`Resultado_aprendizaje`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Resultado_aprendizaje` (
  `id_resultado_aprendizaje` INT NOT NULL AUTO_INCREMENT,
  `codigoResultadoAp` INT NOT NULL,
  `descripcionResul` VARCHAR(45) NOT NULL,
  `Competencias_id_competencias` INT NOT NULL,
  PRIMARY KEY (`id_resultado_aprendizaje`),
  UNIQUE INDEX `codigoResultadoAp_UNIQUE` (`codigoResultadoAp` ) ,
  INDEX `fk_Resultado_aprendizaje_Competencias1_idx` (`Competencias_id_competencias` ) ,
  CONSTRAINT `fk_Resultado_aprendizaje_Competencias1`
    FOREIGN KEY (`Competencias_id_competencias`)
    REFERENCES `ClassControl`.`Competencias` (`id_competencias`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `ClassControl`.`Actividades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`Actividades` (
  `id_actividades` INT NOT NULL AUTO_INCREMENT,
  `codigoActividad` INT NOT NULL,
  `nombre_Act` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(200) NOT NULL,
  `Resultado_aprendizaje_id_resultado_aprendizaje` INT NOT NULL,
  PRIMARY KEY (`id_actividades`),
  UNIQUE INDEX `codigoActividad_UNIQUE` (`codigoActividad` ) ,
  INDEX `fk_Actividades_Resultado_aprendizaje1_idx` (`Resultado_aprendizaje_id_resultado_aprendizaje` ) ,
  CONSTRAINT `fk_Actividades_Resultado_aprendizaje1`
    FOREIGN KEY (`Resultado_aprendizaje_id_resultado_aprendizaje`)
    REFERENCES `ClassControl`.`Resultado_aprendizaje` (`id_resultado_aprendizaje`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `ClassControl`.`VinculacionLaboral`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassControl`.`VinculacionLaboral` (
  `idvinculacionLaboral` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  `numeroContrato` VARCHAR(45) NOT NULL,
  `fechaInicio` DATE NOT NULL,
  `fechaFin` DATE NOT NULL,
  `Usuarios_id_usuarios` INT NOT NULL,
  PRIMARY KEY (`idvinculacionLaboral`),
  UNIQUE INDEX `numeroContrato_UNIQUE` (`numeroContrato` ) ,
  INDEX `fk_VinculacionLaboral_Usuarios1_idx` (`Usuarios_id_usuarios` ) ,
  CONSTRAINT `fk_VinculacionLaboral_Usuarios1`
    FOREIGN KEY (`Usuarios_id_usuarios`)
    REFERENCES `ClassControl`.`Usuarios` (`id_usuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
