# Create your tasks here
from .celery import app
# from people_counter.opencv_counter import PeopleCounter

@app.task
def peoplecounter(x, y):
    # p = PeopleCounter()
    # p.run()
    return 200


# if __name__ == '__main__':
#     app.start()


# @app.task
# def mul(x, y):
#     return x * y


# @app.task
# def xsum(numbers):
#     return sum(numbers)


# @shared_task
# def count_widgets():
#     return Widget.objects.count()


# @shared_task
# def rename_widget(widget_id, name):
#     w = Widget.objects.get(id=widget_id)
#     w.name = name
#     w.save()