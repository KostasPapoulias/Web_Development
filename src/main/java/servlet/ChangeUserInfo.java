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
    public String getServletInfo() {
        return "UpdatePetOwner servlet";
    }
}
