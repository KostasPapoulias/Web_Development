package servlet;

import DB_tables.EditBookingsTable;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class Booking extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Retrieve the ownerId from request parameters
        String ownerIdParam = req.getParameter("ownerId");
        if (ownerIdParam != null) {
            try {
                int ownerId = Integer.parseInt(ownerIdParam);
                EditBookingsTable bookingsTable = new EditBookingsTable();
                List<String> petIds = bookingsTable.getPetIdsByOwnerId(ownerId);

                // Convert the list of pet IDs to a JSON string (or any other format you prefer)
                String jsonResponse = convertListToJson(petIds);

                // Write the response
                resp.setContentType("application/json");
                PrintWriter out = resp.getWriter();
                out.print(jsonResponse);
                out.flush();
            } catch (NumberFormatException e) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid ownerId format");
            } catch (Exception e) {
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while processing the request");
            }
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "ownerId parameter is required");
        }
    }

    // Utility method to convert a list to JSON format. Implement this method based on your JSON library of choice.
    private String convertListToJson(List<String> list) {
        // This is a placeholder. Use your preferred method to convert a list to JSON.
        return list.toString(); // Simple placeholder implementation
    }
}