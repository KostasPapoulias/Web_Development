package servlet;

import DB_tables.EditMessagesTable;
import DB_tables.EditPetsTable;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import mainClasses.Booking;
import mainClasses.Message;
import mainClasses.Pet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GetPostMessages extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        EditMessagesTable editMessagesTable = new EditMessagesTable();
        try {
            editMessagesTable.createMessageTable();
            System.out.println("Messages table created successfully.");
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        StringBuilder jsonBuffer = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBuffer.append(line);
            }
        }

        Gson gson = new Gson();
        mainClasses.Message msg = gson.fromJson(jsonBuffer.toString(), mainClasses.Message.class);

        try {
            editMessagesTable.createNewMessage(msg);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("{ \"status\": \"success\", \"message\": \"Message added successfully.\" }");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
        }
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String booking_id = request.getParameter("booking_id");
        EditMessagesTable editMessagesTable = new EditMessagesTable();
        ArrayList<Message> messages;
        try {
            messages = editMessagesTable.getAllMessagesByBookingId(booking_id);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
            return;
        }

         Gson gson = new Gson();
        String messagesJson = gson.toJson(messages);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(messagesJson);
    }
}
