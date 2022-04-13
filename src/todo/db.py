import sqlite3


def test_db_conn(conn):
    try:
        conn.cursor()
        conn.close()
        return True
    except (Exception, ):
        return False


class Database:
    connection = None
    cursor = None

    def __init__(self):
        self.connection = sqlite3.connect('todolist.db')
        self.cursor = self.connection.cursor()
        if test_db_conn(self.connection):
            print('Database is connected')
        else:
            print("Database is not connected!")

    def get_connection(self):
        self.connection = sqlite3.connect('todolist.db')
        self.cursor = self.connection.cursor()

    def close_connection(self):
        self.connection.close()

    def commit_connection(self):
        self.connection.commit()

    def get_data(self):
        sql_line = """SELECT * FROM todo_item"""
        self.get_connection()
        self.cursor.execute(sql_line)
        result = self.cursor.fetchall()
        self.close_connection()
        restful_dict = {}

        for item in result:
            item_id = item[0]
            item_name = item[1]
            item_ddl = item[2]

            new_dict = {"id": item_id, "name": item_name, "deadline": item_ddl}
            restful_dict[item_id] = new_dict

        return restful_dict

    def insert(self, item_name, item_deadline):
        sql_line = """INSERT INTO todo_item (item_name, due_date) VALUES ('%s', '%s')""" % (item_name, item_deadline)
        self.get_connection()
        self.cursor.execute(sql_line)
        self.commit_connection()
        self.close_connection()

    def delete(self, item_id):
        sql_line = """DELETE FROM todo_item WHERE item_id=%d""" % item_id
        self.get_connection()
        self.cursor.execute(sql_line)
        self.commit_connection()
        self.close_connection()

    def update(self, item_id, item_name, item_deadline):
        sql_line = """UPDATE todo_item
        SET item_name="%s",
            due_date="%s"
        WHERE item_id="%d"
        """ % (item_name, item_deadline, item_id)
        self.get_connection()
        self.cursor.execute(sql_line)
        self.commit_connection()
        self.close_connection()
