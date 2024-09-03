package servlet;

import DB_tables.EditPetKeepersTable;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This servlet deletes a PetKeeper from the database
 */
public class DeletePetKeeper extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (username != null && !username.isEmpty()) {
            try {
                EditPetKeepersTable editPetKeepersTable = new EditPetKeepersTable();
                editPetKeepersTable.deletePetKeeperByUsername(username);
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"message\": \"PetKeeper with username " + username + " was successfully deleted.\"}");
            } catch (ClassNotFoundException e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Error deleting PetKeeper: " + e.getMessage() + "\"}");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid username.\"}");
        }
    }
}