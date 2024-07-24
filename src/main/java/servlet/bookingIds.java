package servlet;

import DB_tables.EditBookingsTable;
import com.google.gson.Gson;
import mainClasses.Booking;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class bookingIds extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        EditBookingsTable editBookingTable = new EditBookingsTable();
        List<Booking> bookings;
        try {
            bookings = editBookingTable.getAllBookings();
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
            return;
        }

        Gson gson = new Gson();
        String bookingsJson = gson.toJson(bookings);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(bookingsJson);
    }
}