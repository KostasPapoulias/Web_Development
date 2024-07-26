package servlet;

import DB_tables.EditMessagesTable;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

public class Message {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder jsonBuffer = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBuffer.append(line);
            }
        }

        Gson gson = new Gson();
        mainClasses.Message msg = gson.fromJson(jsonBuffer.toString(), mainClasses.Message.class);

        EditMessagesTable editMessagesTable = new EditMessagesTable();
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
        ArrayList<mainClasses.Message> messages;
        try {
            messages = editMessagesTable.databaseToMessage(Integer.parseInt(booking_id));
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(500);
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
