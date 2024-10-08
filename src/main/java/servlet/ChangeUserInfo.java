package servlet;

import DB_tables.EditPetOwnersTable;
import com.google.gson.Gson;
import mainClasses.PetOwner;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;

public class ChangeUserInfo extends HttpServlet {


    /**
     * It updates the user's information in the database
     *
     * It returns the petOwner's ID by the username
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();

        Gson gson = new Gson();
        PetOwner updatedPetOwner = gson.fromJson(data, PetOwner.class);

        EditPetOwnersTable eut = new EditPetOwnersTable();

        try {
            eut.updatePetOwnerInfo(updatedPetOwner.getUsername(), updatedPetOwner.getPassword(), updatedPetOwner.getFirstname(), updatedPetOwner.getLastname(), updatedPetOwner.getTelephone());
            response.setStatus(200);
            response.getWriter().println("{ \"status\": \"success\", \"message\": \"Update successful.\" }");
        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
            System.out.println(ex.getMessage());
            response.setStatus(500);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
        }
    }

    @Override


    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");

        if (username == null || username.isEmpty()) {
            response.setStatus(400);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Username is required.\" }");
            return;
        }

        EditPetOwnersTable eut = new EditPetOwnersTable();
        try {
            int ownerId = eut.getOwnerIdByUsername(username);
            response.setStatus(200);
            response.getWriter().println("{ \"status\": \"success\", \"ownerId\": " + ownerId + " }");
        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
            System.out.println(ex.getMessage());
            response.setStatus(500);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error: " + ex.getMessage() + "\" }");
        }
    }

    @Override
    public String getServletInfo() {
        return "UpdatePetOwner servlet";
    }
}
