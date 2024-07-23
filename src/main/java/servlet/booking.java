package servlet;

import DB_tables.EditBookingsTable;

import com.google.gson.Gson;
import mainClasses.Booking;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class booking extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        EditBookingsTable editBookingsTable = new EditBookingsTable();
        try {
            editBookingsTable.createBookingTable();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }

        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();

        Gson gson = new Gson();
        Booking newBook = gson.fromJson(data, Booking.class);



        try ( PrintWriter out = response.getWriter()) {
            //newPet = gson.fromJson(jsonString, Pet.class);

            EditBookingsTable ebt = new EditBookingsTable();

            try {
                ebt.createNewBooking(newBook);

                response.setStatus(200);
                out.println("{ \"status\": \"success\", \"message\": \"Registration successful.\" }");

            } catch (ClassNotFoundException ex) {
                ex.printStackTrace();
                response.setStatus(500);
                out.println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String ownerId = request.getParameter("owner_id");
        EditBookingsTable editBookingTable = new EditBookingsTable();
        ArrayList<String> petIds;
        try {
            petIds = editBookingTable.getPetIdsByOwnerIdFromBookings(ownerId);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
            return;
        }

        Gson gson = new Gson();
        String petIdsJson = gson.toJson(petIds);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(petIdsJson);
    }

    // Utility method to convert a list to JSON format. Implement this method based on your JSON library of choice.
    private String convertListToJson(List<String> list) {
        // This is a placeholder. Use your preferred method to convert a list to JSON.
        return list.toString(); // Simple placeholder implementation
    }
}