package servlet;

import com.google.gson.Gson;
import mainClasses.PetKeeper;
import DB_tables.EditPetKeepersTable;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

public class GetAllAllPetKeepers extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");

        try ( PrintWriter out = response.getWriter()) {
            EditPetKeepersTable eut = new EditPetKeepersTable();
            // Retrieve the type from the request parameters

            ArrayList<PetKeeper> petKeepers = eut.getAllPetKeepers();

            // Convert the list of PetKeepers to JSON
            Gson gson = new Gson();
            String json = gson.toJson(petKeepers);

            // Send the JSON response
            out.println(json);
            response.setStatus(200);
        }
    }
}