package com.example.proyecto.app.util;

import com.example.proyecto.app.model.Reserva;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Tab;
import com.itextpdf.layout.element.TabStop;
import com.itextpdf.layout.properties.TabAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

public class PdfGenerator {

    /**
     * Genera un comprobante de reserva en formato PDF.
     * @param reserva La reserva para la cual se genera el comprobante.
     * @return Arreglo de bytes con el contenido del PDF.
     * @throws Exception Si ocurre un error durante la generación.
     */
    public static byte[] generarComprobante(Reserva reserva) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Configurar márgenes
        document.setMargins(20, 20, 20, 20);

        // Título del hotel
        Paragraph titulo = new Paragraph("HOTEL DESARROLLO DE SW II")
                .setBold()
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(titulo);

        // Subtítulo
        Paragraph subtitulo = new Paragraph("Comprobante de reserva")
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(subtitulo);

        // Línea separadora
        document.add(new Paragraph("_________________________________________________")
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(15));

        // Datos del huésped
        document.add(new Paragraph("DATOS DEL HUÉSPED").setBold().setFontSize(12));
        document.add(new Paragraph("Nombre: " + reserva.getHuesped().getNombre() +
                "   DNI: " + reserva.getHuesped().getDni()));
        document.add(new Paragraph("Teléfono: " + reserva.getHuesped().getTelefono() +
                "   Email: " + reserva.getHuesped().getEmail()));
        document.add(new Paragraph(" "));

        // Datos de la habitación
        document.add(new Paragraph("DATOS DE LA HABITACIÓN").setBold().setFontSize(12));
        document.add(new Paragraph("Número: " + reserva.getHabitacion().getNumero() +
                "   Tipo: " + reserva.getHabitacion().getTipo().getNombre()));
        document.add(new Paragraph("Detalle: " + reserva.getHabitacion().getTipo().getDescripcion()));
        document.add(new Paragraph(" "));

        // Fechas de estadía
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        document.add(new Paragraph("FECHA DE ESTADÍA").setBold().setFontSize(12));
        document.add(new Paragraph("Fecha de ingreso: " + reserva.getFechaInicio().format(formatter)));
        document.add(new Paragraph("Fecha de salida:  " + reserva.getFechaFin().format(formatter)));
        document.add(new Paragraph(" "));

        // Resumen de cargos
        document.add(new Paragraph("RESUMEN DE CARGOS").setBold().setFontSize(12));
        document.add(new Paragraph("Noches: " + reserva.getNoches()));
        document.add(new Paragraph("Precio por noche: S/ " + String.format("%.2f", reserva.getPrecioNoche())));
        document.add(new Paragraph(" "));

        // Total (destacado)
        Paragraph total = new Paragraph()
                .add(new Paragraph("TOTAL A PAGAR: S/ " + String.format("%.2f", reserva.getTotal())))
                .setBold()
                .setFontSize(14)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(10);
        document.add(total);

        // Pie de página
        document.add(new Paragraph(" ")
                .setMarginTop(30));
        document.add(new Paragraph("Este comprobante es válido como constancia de su reserva.")
                .setFontSize(10)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("Gracias por preferirnos.")
                .setFontSize(10)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER));

        // Cerrar documento
        document.close();

        return baos.toByteArray();
    }
}