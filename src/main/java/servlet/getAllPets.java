package servlet;

import DB_tables.EditPetsTable;
import com.google.gson.Gson;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Pet;

public class getAllPets extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        EditPetsTable petsTable = new EditPetsTable();
        ArrayList<Pet> pets = new ArrayList<>();

        try {
            pets = petsTable.getAllPets();
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        String json = new Gson().toJson(pets);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}