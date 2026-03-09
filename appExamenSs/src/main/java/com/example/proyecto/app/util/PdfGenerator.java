package com.example.proyecto.app.util;

import com.example.proyecto.app.model.Reserva;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

public class PdfGenerator {

    // Colores personalizados
    private static final DeviceRgb COLOR_PRIMARY = new DeviceRgb(102, 126, 234);    // Morado claro
    private static final DeviceRgb COLOR_SECONDARY = new DeviceRgb(76, 81, 191);    // Morado oscuro
    private static final DeviceRgb COLOR_ACCENT = new DeviceRgb(255, 193, 7);        // Amarillo
    private static final DeviceRgb COLOR_LIGHT_GRAY = new DeviceRgb(245, 245, 245);  // Gris claro

    public static byte[] generarComprobante(Reserva reserva) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Configurar márgenes
        document.setMargins(30, 30, 30, 30);

        // --- CABECERA ---
        // Título del hotel con color
        Paragraph titulo = new Paragraph("HOTELSITO")
                .setBold()
                .setFontSize(24)
                .setFontColor(COLOR_PRIMARY)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(titulo);

        // Lema
        Paragraph lema = new Paragraph("Tu mejor opción en hospedaje")
                .setFontSize(12)
                .setFontColor(COLOR_SECONDARY)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        document.add(lema);

        // Línea decorativa
        Table linea = new Table(1);
        linea.setWidth(UnitValue.createPercentValue(100));
        linea.setHeight(2);
        linea.setBackgroundColor(COLOR_PRIMARY);
        document.add(linea);
        document.add(new Paragraph("\n"));

        // --- DATOS DEL COMPROBANTE ---
        Paragraph comprobante = new Paragraph("COMPROBANTE DE RESERVA")
                .setBold()
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(COLOR_SECONDARY)
                .setMarginBottom(20);
        document.add(comprobante);

        // --- TABLA DE DATOS DEL HUÉSPED Y HABITACIÓN ---
        Table tablaInfo = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
        tablaInfo.setWidth(UnitValue.createPercentValue(100));
        tablaInfo.setMarginBottom(15);

        // Celda de huésped
        Cell cellHuesped = new Cell()
                .setBackgroundColor(COLOR_LIGHT_GRAY)
                .setPadding(10)
                .setBorder(null);
        cellHuesped.add(new Paragraph("DATOS DEL HUÉSPED").setBold().setFontSize(12));
        cellHuesped.add(new Paragraph("Nombre: " + reserva.getHuesped().getNombre()));
        cellHuesped.add(new Paragraph("DNI: " + reserva.getHuesped().getDni()));
        cellHuesped.add(new Paragraph("Teléfono: " + reserva.getHuesped().getTelefono()));
        cellHuesped.add(new Paragraph("Email: " + reserva.getHuesped().getEmail()));

        // Celda de habitación
        Cell cellHabitacion = new Cell()
                .setBackgroundColor(COLOR_LIGHT_GRAY)
                .setPadding(10)
                .setBorder(null);
        cellHabitacion.add(new Paragraph("DATOS DE LA HABITACIÓN").setBold().setFontSize(12));
        cellHabitacion.add(new Paragraph("Número: " + reserva.getHabitacion().getNumero()));
        cellHabitacion.add(new Paragraph("Tipo: " + reserva.getHabitacion().getTipo().getNombre()));
        cellHabitacion.add(new Paragraph("Detalle: " + reserva.getHabitacion().getTipo().getDescripcion()));

        tablaInfo.addCell(cellHuesped);
        tablaInfo.addCell(cellHabitacion);
        document.add(tablaInfo);

        // --- FECHAS DE ESTADÍA ---
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        Table tablaFechas = new Table(2);
        tablaFechas.setWidth(UnitValue.createPercentValue(100));
        tablaFechas.setMarginBottom(15);

        Cell fechaInicioCell = new Cell()
                .setBackgroundColor(COLOR_LIGHT_GRAY)
                .setPadding(8)
                .setBorder(null);
        fechaInicioCell.add(new Paragraph("Fecha de ingreso").setBold());
        fechaInicioCell.add(new Paragraph(reserva.getFechaInicio().format(formatter)));

        Cell fechaFinCell = new Cell()
                .setBackgroundColor(COLOR_LIGHT_GRAY)
                .setPadding(8)
                .setBorder(null);
        fechaFinCell.add(new Paragraph("Fecha de salida").setBold());
        fechaFinCell.add(new Paragraph(reserva.getFechaFin().format(formatter)));

        tablaFechas.addCell(fechaInicioCell);
        tablaFechas.addCell(fechaFinCell);
        document.add(tablaFechas);

        // --- RESUMEN DE CARGOS ---
        Table tablaCargos = new Table(2);
        tablaCargos.setWidth(UnitValue.createPercentValue(100));
        tablaCargos.setMarginBottom(15);

        Cell nochesCell = new Cell()
                .setBackgroundColor(COLOR_LIGHT_GRAY)
                .setPadding(8)
                .setBorder(null);
        nochesCell.add(new Paragraph("Noches").setBold());
        nochesCell.add(new Paragraph(String.valueOf(reserva.getNoches())));

        Cell precioCell = new Cell()
                .setBackgroundColor(COLOR_LIGHT_GRAY)
                .setPadding(8)
                .setBorder(null);
        precioCell.add(new Paragraph("Precio por noche").setBold());
        precioCell.add(new Paragraph("S/ " + String.format("%.2f", reserva.getPrecioNoche())));

        tablaCargos.addCell(nochesCell);
        tablaCargos.addCell(precioCell);
        document.add(tablaCargos);

        // --- TOTAL DESTACADO ---
        Paragraph total = new Paragraph("TOTAL A PAGAR: S/ " + String.format("%.2f", reserva.getTotal()))
                .setBold()
                .setFontSize(18)
                .setFontColor(COLOR_PRIMARY)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(10);
        document.add(total);

        // --- PIE DE PÁGINA ---
        document.add(new Paragraph("\n"));
        Paragraph pie1 = new Paragraph("Este comprobante es válido como constancia de su reserva.")
                .setFontSize(10)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER);
        Paragraph pie2 = new Paragraph("¡Gracias por preferir HOTELSITO!")
                .setFontSize(10)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER);
        document.add(pie1);
        document.add(pie2);

        // Cerrar documento
        document.close();

        return baos.toByteArray();
    }
}