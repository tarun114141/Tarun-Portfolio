marks_done=0
attendance_done=0


input_info (){
	echo -n "Enter name : "
  read name
  echo -n "Enter PRN : " 
  read prn
  echo -n "Enter Roll : "
  read roll
}

average(){
	echo -n "Enter Maths marks: "
  read M_marks
  echo -n "Enter Science marks: "
  read S_marks
  echo -n "Enter English marks: "
  read E_marks
  echo -n "Enter Computer marks: "
  read C_marks
  total_marks=$((M_marks+S_marks+E_marks+C_marks))
  avg_marks=$((total_marks/4))
  
  echo "average marks = $avg_marks"
  
  if [ $avg_marks -lt 60 ]
  then
  	echo "Grade = E"
  elif [ $avg_marks -lt 70 ]
  then
  	echo "Your grade is D"
  elif [ $avg_marks -lt 80 ] 
  then
  	echo "Your grade is C"
  elif [ $avg_marks -lt 90 ] 
  then
  	echo "Your grade is B"
  else
  	echo "Your grade is A"
  fi
  
  
    improvement_subjects=()
  if [ $M_marks -lt 70 ] 
  then
  	improvement_subjects=("${improvement_subjects[@]}" "Maths")
  fi  
  if [ $S_marks -lt 70 ]
  then
  	improvement_subjects=("${improvement_subjects[@]}" "Science")
  fi  
  if [ $E_marks -lt 70 ] 
  then
  	improvement_subjects=("${improvement_subjects[@]}" "English")
  fi  
  if [ $C_marks -lt 70 ]
  then
  	improvement_subjects=("${improvement_subjects[@]}" "Computer")
  fi
  marks_done=1  
}






attendance (){
	echo "Enter attendance of each subject"
  echo -n "Maths : "
  read M_attendance
  echo -n "Science : "
  read S_attendance
  echo -n "English : "
  read E_attendance
  echo -n "Computer : "
  read C_attendance

  average_attendance=$(((M_attendance+S_attendance+E_attendance+C_attendance)/4))
  echo "Your average attendance is $average_attendance %"
  attendance_subjects=()
  if [ $M_attendance -lt 75 ] 
  then
  	attendance_subjects=("${attendance_subjects[@]}" "Maths")
  fi
  if [ $S_attendance -lt 75 ] 
  then
  	attendance_subjects=("${attendance_subjects[@]}" "Science")
  fi
  if [ $E_attendance -lt 75 ] 
  then
  	attendance_subjects=("${attendance_subjects[@]}" "English")
  fi
  if [ $C_attendance -lt 75 ] 
  then
  	attendance_subjects=("${attendance_subjects[@]}" "Computer")
  fi
  attendance_done=1
}


feedback (){
  if [ $marks_done == 1 ]
  then
    for subject in ${improvement_subjects[@]}
    do
      echo You need to improve marks in $subject
    done
  else 
    echo "Check marks to get feedback on marks"
  fi
  
  if [ $attendance_done == 1 ]
  then
    for subject in ${attendance_subjects[@]}
    do
  	  echo You need to attend more classes of $subject
    done
  else
    echo "Check attendance to get feedback on attendance"
  fi
  
   
}

menu (){
  echo "#### MENU ####"
  echo "Press 1 to check average marks and grade of student"
  echo "Press 2 to check attendence"
  echo "Press 3 for feedback"
  echo "Press 4 to exit"
  echo -n "Choice : "
  read x
  case ${x} in
  1) average ;;
  2) attendance ;;
  3) feedback ;;
  4) end=1;;
  *) echo "Invalid input" ;;
  esac
}

end=0
echo "Enter information of student"
input_info
menu
while [ $end == 0 ]
do
    menu
done






