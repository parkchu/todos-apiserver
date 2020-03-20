from django.db import models

class ToDos(models.Model):
    text = models.CharField(max_length=100)
    todo_id = models.IntegerField()
    finish = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['created']
    def __str__(self):
        return self.text