from django.db import models


class Users(models.Model):
    api_id = models.TextField(null=True,blank=False)
    email = models.TextField(null=True,blank=False)
    password = models.TextField(null=True,blank=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created']

class Stay(models.Model):
    place = models.TextField(null=False,blank=False)
    dateTime = models.DateTimeField(auto_now_add=True)
    inout = models.IntegerField(null=True,blank=False)

    def __str__(self):
        return str(self.dateTime)

