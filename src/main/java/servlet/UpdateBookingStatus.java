package servlet;

import DB_tables.EditBookingsTable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

public class UpdateBookingStatus extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String bookingId = request.getParameter("booking_id");
        String status = request.getParameter("status");

        if (bookingId == null || status == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Missing booking_id or status parameter");
            return;
        }


        try {
            EditBookingsTable editBookingsTable = new EditBookingsTable();
            editBookingsTable.updateBooking(Integer.parseInt(bookingId), status);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Booking status updated successfully");
        } catch (SQLException | ClassNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error updating booking status: " + e.getMessage());
        }
    }
}