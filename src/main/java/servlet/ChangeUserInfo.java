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
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String firstname = request.getParameter("firstname");
        String lastname = request.getParameter("lastname");
        String phone = request.getParameter("phone");

        PetOwner updatedPetOwner = new PetOwner();
        updatedPetOwner.setUsername(username);
        updatedPetOwner.setPassword(password);
        updatedPetOwner.setFirstname(firstname);
        updatedPetOwner.setLastname(lastname);
        updatedPetOwner.setTelephone(phone);

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
