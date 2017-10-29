from subprocess import call

call(["flite", "-t",'.....  What is your name?']);
name = raw_input("What is your name? ");

call(["flite","-t",'.....  Nice to meet you ' + str(name)]);
